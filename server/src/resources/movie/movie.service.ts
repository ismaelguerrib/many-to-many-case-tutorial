import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
  DataSource,
  In
} from 'typeorm'

import {
  Paginator,
  PaginationService,
  ExcelService
} from '@casejs/nest-library'
import { Movie } from './movie.entity'
import { CreateUpdateMovieDto } from './dtos/create-update-movie.dto'
import { Actor } from '../actor/actor.entity'

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private paginationService: PaginationService,
    private excelService: ExcelService,
    private dataSource: DataSource
  ) {}

  async index({
    movieIds,
    page,
    orderBy,
    orderByDesc,
    toXLS,
    withoutPagination
  }: {
    movieIds?: string[]
    page?: string
    orderBy?: string
    orderByDesc?: boolean
    toXLS?: boolean
    withoutPagination?: boolean
  }): Promise<Paginator<Movie> | Movie[] | string> {
    const query = this.repository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.actors', 'actor')

    if (movieIds) {
      query.andWhere('movie.id IN (:movieIds)', { movieIds })
    }

    if (orderBy) {
      query.orderBy(
        orderBy.includes('.') ? orderBy : 'movie.' + orderBy,
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
      transformResult: (movie: Movie) => {
        // Create a coma-separated string with all actors names.
        movie.actorNames = movie.actors
          .map((actor: Actor) => actor.name)
          .join(', ')
        return movie
      },
      currentPage: page ? parseInt(page, 10) : 1
    })
  }

  async export(query: SelectQueryBuilder<Movie>): Promise<string> {
    const movies = await query.getMany()
    return this.excelService.export(
      ['Id'],
      movies.map((movie: Movie) => [movie.id]),
      'movies'
    )
  }

  async show(id: number): Promise<Movie> {
    const movie = await this.repository.findOneOrFail({ where: { id } })

    return movie
  }

  async store(movieDto: CreateUpdateMovieDto): Promise<Movie> {
    const movie: Movie = this.repository.create(movieDto)

    if (movieDto.actorIds?.length) {
      movie.actors = await this.dataSource
        .getRepository(Actor)
        .findBy({ id: In(movieDto.actorIds) })
    }

    return await this.repository.save(movie)
  }

  async update(
    whereParams: { id?: number; token?: string },
    movieDto: CreateUpdateMovieDto
  ): Promise<UpdateResult> {
    let oldMovie: Movie = await this.repository.findOne({
      where: whereParams,
      relations: {
        actors: true
      }
    })

    if (!oldMovie) {
      throw new NotFoundException('Movie not found')
    }

    const movie: Movie = await this.repository.create(movieDto)

    // Update relationships.
    await this.dataSource
      .createQueryBuilder()
      .relation(Movie, 'actors')
      .of(oldMovie.id)
      .remove(oldMovie.actors.map((actor: Actor) => actor.id))

    if (movieDto.actorIds && movieDto.actorIds.length) {
      await this.dataSource
        .createQueryBuilder()
        .relation(Movie, 'actors')
        .of(oldMovie.id)
        .add(movieDto.actorIds)
    }

    return await this.repository.update(oldMovie.id, movie)
  }

  async destroy(id: number): Promise<DeleteResult> {
    const movie: Movie = await this.repository.findOneOrFail({ where: { id } })

    return await this.repository.delete(movie.id)
  }
}
