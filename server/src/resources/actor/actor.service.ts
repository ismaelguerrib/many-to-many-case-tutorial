import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeleteResult,
  In,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
  DataSource
} from 'typeorm'

import {
  Paginator,
  PaginationService,
  ExcelService
} from '@casejs/nest-library'
import { Actor } from './actor.entity'
import { CreateUpdateActorDto } from './dtos/create-update-actor.dto'
import { Movie } from '../movie/movie.entity'

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly repository: Repository<Actor>,
    private paginationService: PaginationService,
    private excelService: ExcelService,
    private dataSource: DataSource
  ) {}

  async index({
    actorIds,
    page,
    orderBy,
    orderByDesc,
    toXLS,
    withoutPagination
  }: {
    actorIds?: string[]
    page?: string
    orderBy?: string
    orderByDesc?: boolean
    toXLS?: boolean
    withoutPagination?: boolean
  }): Promise<Paginator<Actor> | Actor[] | string> {
    const query = this.repository
      .createQueryBuilder('actor')
      .leftJoinAndSelect('actor.movies', 'movie')

    if (actorIds) {
      query.andWhere('actor.id IN (:actorIds)', { actorIds })
    }

    if (orderBy) {
      query.orderBy(
        orderBy.includes('.') ? orderBy : 'actor.' + orderBy,
        orderByDesc ? 'DESC' : 'ASC'
      )
    }

    if (toXLS) {
      return this.export(query)
    }

    if (withoutPagination) {
      return await query.getMany()
    }

    return await this.paginationService.paginate({
      query,
      transformResult: (actor: Actor) => {
        actor.movieNames = actor.movies
          .map((movie: Movie) => movie.name)
          .join(', ')
        return actor
      },
      currentPage: page ? parseInt(page, 10) : 1
    })
  }

  async export(query: SelectQueryBuilder<Actor>): Promise<string> {
    const actors = await query.getMany()
    return this.excelService.export(
      ['Id'],
      actors.map((actor: Actor) => [actor.id]),
      'actors'
    )
  }

  async show(id: number): Promise<Actor> {
    const actor: Actor = await this.repository.findOneOrFail({
      where: { id },
      relations: { movies: true }
    })

    actor.movieIds = actor.movies.map((movie: Movie) => movie.id)

    return actor
  }

  async store(actorDto: CreateUpdateActorDto): Promise<Actor> {
    const actor: Actor = this.repository.create(actorDto)

    if (actorDto.movieIds?.length) {
      actor.movies = await this.dataSource
        .getRepository(Movie)
        .findBy({ id: In(actorDto.movieIds) })
    }

    return await this.repository.save(actor)
  }

  async update(
    whereParams: { id?: number; token?: string },
    actorDto: CreateUpdateActorDto
  ): Promise<UpdateResult> {
    let oldActor: Actor = await this.repository.findOne({
      where: whereParams,
      relations: {
        movies: true
      }
    })

    if (!oldActor) {
      throw new NotFoundException('Actor not found')
    }

    const actor: Actor = await this.repository.create(actorDto)

    // Update relationships.
    await this.dataSource
      .createQueryBuilder()
      .relation(Actor, 'movies')
      .of(oldActor.id)
      .remove(oldActor.movies.map((movie: Movie) => movie.id))

    if (actorDto.movieIds && actorDto.movieIds.length) {
      await this.dataSource
        .createQueryBuilder()
        .relation(Actor, 'movies')
        .of(oldActor.id)
        .add(actorDto.movieIds)
    }

    return await this.repository.update(oldActor.id, actor)
  }

  async destroy(id: number): Promise<DeleteResult> {
    const actor: Actor = await this.repository.findOneOrFail({ where: { id } })

    return await this.repository.delete(actor.id)
  }
}
