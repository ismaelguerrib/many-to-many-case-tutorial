import { Movie } from './../resources/movie/movie.entity'
import { Actor } from './../resources/actor/actor.entity'
import { SearchResult } from '@casejs/nest-library'
import { Injectable } from '@nestjs/common'
import {
  Brackets,
  DataSource,
  SelectQueryBuilder,
  WhereExpressionBuilder
} from 'typeorm'

import { Role } from '../resources/case/role.entity'
import { User } from '../resources/user/user.entity'

@Injectable()
export class SearchService {
  constructor(private dataSource: DataSource) {}

  // Main search function : searches terms on several pre-defined fields of several resources.
  async search({
    terms,
    resources
  }: {
    terms: string
    resources: string[]
  }): Promise<SearchResult[]> {
    let searchResults: SearchResult[] = []

    if (!terms || !resources || !resources.length) {
      return Promise.resolve([])
    }

    // * Search resources (keep comment for schematics).
if (
        resources.includes(Movie.name) &&
        Movie.searchableFields &&
        Movie.searchableFields.length
      ) {
        const movies: SearchResult[] = await this.searchResource(Movie, terms)
        searchResults = [...searchResults, ...movies]
      }
if (
        resources.includes(Actor.name) &&
        Actor.searchableFields &&
        Actor.searchableFields.length
      ) {
        const actors: SearchResult[] = await this.searchResource(Actor, terms)
        searchResults = [...searchResults, ...actors]
      }
    if (
      resources.includes(User.name) &&
      User.searchableFields &&
      User.searchableFields.length
    ) {
      const users: SearchResult[] = await this.searchResource(User, terms)
      searchResults = [...searchResults, ...users]
    }

    if (
      resources.includes(Role.name) &&
      Role.searchableFields &&
      Role.searchableFields.length
    ) {
      const roles: SearchResult[] = await this.searchResource(Role, terms)
      searchResults = [...searchResults, ...roles]
    }

    return searchResults
  }

  // Get full SearchResult object based on resource Ids. Used to display selection.
  async getSearchResultObjects(query: {
    [key: string]: string | string[]
  }): Promise<SearchResult[]> {
    let searchResults: SearchResult[] = []

    // * Get search result objects (keep comment for schematics).
if (query.movieIds && query.movieIds.length || query.movieId) {
        const movies: SearchResult[] = await this.getSearchResultObjectsForResource(
          Movie,
          query.movieIds || query.movieId
        )
        searchResults = [...searchResults, ...movies]
      }
if (query.actorIds && query.actorIds.length || query.actorId) {
        const actors: SearchResult[] = await this.getSearchResultObjectsForResource(
          Actor,
          query.actorIds || query.actorId
        )
        searchResults = [...searchResults, ...actors]
      }
    if (query.userIds && query.userIds.length) {
      const users: SearchResult[] =
        await this.getSearchResultObjectsForResource(User, query.userIds)
      searchResults = [...searchResults, ...users]
    }
    if (query.roleIds && query.roleIds.length) {
      const roles: SearchResult[] =
        await this.getSearchResultObjectsForResource(Role, query.roleIds)
      searchResults = [...searchResults, ...roles]
    }

    return searchResults
  }

  private async searchResource(
    resourceClass: any,
    terms: string
  ): Promise<SearchResult[]> {
    const query: SelectQueryBuilder<any> = this.dataSource
      .getRepository(resourceClass)
      .createQueryBuilder('resource')
      // Search through all searchableFields.
      .andWhere(
        new Brackets((qb) => {
          resourceClass.searchableFields.reduce(
            (qb: WhereExpressionBuilder, searchableField: string) =>
              qb.orWhere(`resource.${searchableField} like :terms`, {
                terms: `%${terms}%`
              }),
            qb
          )
        })
      )

    const resources: any[] = await query.limit(50).getMany()

    return resources.map((resource: any) => ({
      id: resource.id,
      label: resource[resourceClass.displayName],
      resourceName: resourceClass.name
    }))
  }

  private async getSearchResultObjectsForResource(
    resourceClass: any,
    ids: string | string[]
  ): Promise<SearchResult[]> {
    const resources: any[] = await this.dataSource
      .getRepository(resourceClass)
      .createQueryBuilder('resource')
      .whereInIds(ids)
      .getMany()

    return resources.map((resource: User) => ({
      id: resource.id,
      label: resource[resourceClass.displayName],
      resourceName: resourceClass.name
    }))
  }
}
