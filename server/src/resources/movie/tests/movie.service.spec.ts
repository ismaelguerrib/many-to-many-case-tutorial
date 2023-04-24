import {
  ExcelService,
  PaginationService,
  Paginator
} from '@casejs/nest-library'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'

import { CreateUpdateMovieDto } from '../dtos/create-update-movie.dto'
import { Movie } from '../movie.entity'
import { MovieService } from '../movie.service'

describe('MovieService', () => {
  let movieService: MovieService
  let repositoryMock: MockType<Repository<Movie>>

  const testMovie = { id: 1, name: 'Test' }
  const testMovieDto: CreateUpdateMovieDto = {
    
  }
  const createQueryBuilder: any = {
    select: () => createQueryBuilder,
    addSelect: () => createQueryBuilder,
    orderBy: () => createQueryBuilder,
    groupBy: () => createQueryBuilder,
    where: () => createQueryBuilder,
    andWhere: () => createQueryBuilder,
    leftJoinAndSelect: () => createQueryBuilder,
    getMany: () => [testMovie],
    getOne: () => testMovie
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useFactory: repositoryMockFactory
        },
        {
          provide: PaginationService,
          useValue: {
            paginate: () => ({
              data: [testMovie],
              currentPage: 1,
              lastPage: 1,
              from: 1,
              to: 1,
              total: 1,
              perPage: 1
            })
          }
        },
        {
          provide: ExcelService,
          useValue: {
            export: () => 'path-to-csv-file.csv'
          }
        }
      ]
    }).compile()
    movieService = module.get<MovieService>(MovieService)
    repositoryMock = module.get(getRepositoryToken(Movie))
  })

  it('should list movies', async () => {
    expect.assertions(8)

    repositoryMock.createQueryBuilder?.mockImplementation(
      () => createQueryBuilder
    )

    const moviePaginator: Paginator<Movie> = (await movieService.index(
      {}
    )) as Paginator<Movie>
    const movies: Movie[] = (await movieService.index({
      withoutPagination: true
    })) as Movie[]

    expect(Array.isArray(movies)).toBe(true)
    expect(moviePaginator).toHaveProperty('currentPage')
    expect(moviePaginator).toHaveProperty('lastPage')
    expect(moviePaginator).toHaveProperty('from')
    expect(moviePaginator).toHaveProperty('to')
    expect(moviePaginator).toHaveProperty('total')
    expect(moviePaginator).toHaveProperty('perPage')
    expect(Array.isArray(moviePaginator.data)).toBe(true)
  })

  it('should show an movie', async () => {
    expect.assertions(2)
    repositoryMock.findOneOrFail?.mockReturnValue(testMovie)

    await expect(movieService.show(testMovie.id)).resolves.toEqual(testMovie)
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({
      where: { id: testMovie.id }
    })
  })

  it('should store an movie', async () => {
    const dummyId = 56

    repositoryMock.create?.mockReturnValue(testMovieDto)
    repositoryMock.save?.mockReturnValue(
      Object.assign(testMovieDto, { id: dummyId })
    )

    const storedMovie: Movie = await movieService.store(testMovieDto)

    expect(storedMovie).toHaveProperty('id', dummyId)
  })

  it('should update an movie', async () => {
    repositoryMock.createQueryBuilder?.mockImplementation(
      () => createQueryBuilder
    )
    repositoryMock.create?.mockReturnValue(testMovieDto)

    const updatedResult: UpdateResult = await movieService.update(1, testMovieDto)

    expect(repositoryMock.create).toHaveBeenCalled()
    expect(repositoryMock.update).toHaveBeenCalled()
  })

  it('should delete an movie', async () => {
    expect.assertions(2)

    const mockDeleteResult = { raw: 'mock data delete result' }

    repositoryMock.delete?.mockReturnValue(mockDeleteResult)
    repositoryMock.findOneOrFail?.mockReturnValue(testMovie)

    await expect(movieService.destroy(testMovie.id)).resolves.toEqual(
      mockDeleteResult
    )
    expect(repositoryMock.delete).toHaveBeenCalledWith(testMovie.id)
  })
})

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    delete: jest.fn(),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    update: jest.fn()
  })
)

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}
