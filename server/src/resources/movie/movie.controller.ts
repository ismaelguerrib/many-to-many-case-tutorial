import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { UpdateResult, DeleteResult } from 'typeorm'
import {
  Permission,
  Paginator,
  AuthGuard,
  SelectOption
} from '@casejs/nest-library'

import { MovieService } from './movie.service'
import { Movie } from './movie.entity'
import { CreateUpdateMovieDto } from './dtos/create-update-movie.dto'

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Permission('browseMovies')
  async index(
    @Query('movieIds') movieIds?: string[],
    @Query('page') page?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderByDesc', ParseBoolPipe) orderByDesc?: boolean,
    @Query('withoutPagination', ParseBoolPipe) withoutPagination?: boolean,
    @Query('toXLS', ParseBoolPipe) toXLS?: boolean
  ): Promise<Paginator<Movie> | Movie[] | string> {
    return this.movieService.index({
      movieIds,
      page,
      orderBy,
      orderByDesc,
      withoutPagination,
      toXLS
    })
  }

  @Get('select-options')
  @UseGuards(AuthGuard)
  async listSelectOptions(
    @Query('orderBy') orderBy?: string,
    @Query('orderByDesc', ParseBoolPipe) orderByDesc?: boolean
  ): Promise<SelectOption[]> {
    const movies: Movie[] = (await this.movieService.index({
      withoutPagination: true,
      orderBy,
      orderByDesc
    })) as Movie[]

    return movies.map((movie: Movie) => ({
      label: `movie ${movie.id}`,
      value: movie.id
    }))
  }

  @Get('/:id')
  @Permission('readMovies')
  async show(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.show(id)
  }

  @Post()
  @Permission('addMovies')
  async store(@Body() movieDto: CreateUpdateMovieDto): Promise<Movie> {
    return await this.movieService.store(movieDto)
  }

  @Put('/:id')
  @Permission('editMovies')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() movieDto: CreateUpdateMovieDto
  ): Promise<UpdateResult> {
    return await this.movieService.update({ id }, movieDto)
  }

  @Delete('/:id')
  @Permission('deleteMovies')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.movieService.destroy(id)
  }
}
