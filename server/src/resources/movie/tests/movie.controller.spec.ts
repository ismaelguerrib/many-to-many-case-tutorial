import { AuthService, SelectOption } from '@casejs/nest-library'
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateResult } from 'typeorm'

import { CreateUpdateMovieDto } from '../dtos/create-update-movie.dto'
import { MovieController } from '../movie.controller'
import { Movie } from '../movie.entity'
import { MovieService } from '../movie.service'

describe('MovieController', () => {
  let movieController: MovieController
  let movieService: MovieService

  const testMovie = {
    id: 1,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieController,
        {
          provide: MovieService,
          useValue: {
            show: jest.fn(),
            destroy: jest.fn(),
            store: jest.fn(),
            update: jest.fn(),
            index: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            show: () => Promise.resolve({})
          }
        }
      ]
    }).compile()
    movieController = module.get<MovieController>(MovieController)
    movieService = module.get<MovieService>(MovieService)
  })

  describe('MovieController', () => {
    it('should list movies', async () => {
      expect.assertions(2)
      const result: Movie[] = [testMovie] as any[]

      jest.spyOn(movieService, 'index').mockReturnValue(Promise.resolve(result))

      expect(await movieController.index()).toBe(result)
      expect(movieService.index).toHaveBeenCalled()
    })

    it('should get a list of select options', async () => {
      expect.assertions(3)
      const result: Movie[] = [testMovie] as any[]

      jest.spyOn(movieService, 'index').mockReturnValue(Promise.resolve(result))

      const selectOptions: SelectOption[] =
        await movieController.listSelectOptions()

      expect(Array.isArray(selectOptions)).toBe(true)
      expect(selectOptions[0]).toHaveProperty('label')
      expect(selectOptions[0]).toHaveProperty('value')
    })

    it('should show an movie', async () => {
      expect.assertions(2)
      const result: Movie = testMovie as Movie

      jest.spyOn(movieService, 'show').mockReturnValue(Promise.resolve(result))

      expect(await movieController.show(testMovie.id)).toBe(result)
      expect(movieService.show).toHaveBeenCalledWith(testMovie.id)
    })

    it('should store an movie', async () => {
      expect.assertions(2)

      const testMovieDto: CreateUpdateMovieDto = Object.assign(testMovie, { roleId: 1 })

      jest
        .spyOn(movieService, 'store')
        .mockReturnValue(Promise.resolve(testMovie as any))

      expect(await movieService.store(testMovieDto)).toBe(testMovie)
      expect(movieService.store).toHaveBeenCalledWith(testMovie)
    })

    it('should update an movie', async () => {
      expect.assertions(2)
      const result: UpdateResult = { raw: 'dummy', generatedMaps: [] }

      const testMovieDto: CreateUpdateMovieDto = Object.assign(testMovie, { roleId: 1 })

      jest.spyOn(movieService, 'update').mockReturnValue(Promise.resolve(result))

      expect(await movieService.update(testMovie.id, testMovieDto)).toBe(result)
      expect(movieService.update).toHaveBeenCalledWith(testMovie.id, testMovie)
    })

    it('should delete an movie', async () => {
      jest.spyOn(movieService, 'destroy')

      await movieController.delete(testMovie.id)

      expect(movieService.destroy).toBeCalledWith(testMovie.id)
    })
  })
})
