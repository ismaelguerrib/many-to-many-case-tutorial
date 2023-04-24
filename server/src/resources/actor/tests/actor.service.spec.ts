import {
  ExcelService,
  PaginationService,
  Paginator
} from '@casejs/nest-library'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'

import { CreateUpdateActorDto } from '../dtos/create-update-actor.dto'
import { Actor } from '../actor.entity'
import { ActorService } from '../actor.service'

describe('ActorService', () => {
  let actorService: ActorService
  let repositoryMock: MockType<Repository<Actor>>

  const testActor = { id: 1, name: 'Test' }
  const testActorDto: CreateUpdateActorDto = {
    
  }
  const createQueryBuilder: any = {
    select: () => createQueryBuilder,
    addSelect: () => createQueryBuilder,
    orderBy: () => createQueryBuilder,
    groupBy: () => createQueryBuilder,
    where: () => createQueryBuilder,
    andWhere: () => createQueryBuilder,
    leftJoinAndSelect: () => createQueryBuilder,
    getMany: () => [testActor],
    getOne: () => testActor
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorService,
        {
          provide: getRepositoryToken(Actor),
          useFactory: repositoryMockFactory
        },
        {
          provide: PaginationService,
          useValue: {
            paginate: () => ({
              data: [testActor],
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
    actorService = module.get<ActorService>(ActorService)
    repositoryMock = module.get(getRepositoryToken(Actor))
  })

  it('should list actors', async () => {
    expect.assertions(8)

    repositoryMock.createQueryBuilder?.mockImplementation(
      () => createQueryBuilder
    )

    const actorPaginator: Paginator<Actor> = (await actorService.index(
      {}
    )) as Paginator<Actor>
    const actors: Actor[] = (await actorService.index({
      withoutPagination: true
    })) as Actor[]

    expect(Array.isArray(actors)).toBe(true)
    expect(actorPaginator).toHaveProperty('currentPage')
    expect(actorPaginator).toHaveProperty('lastPage')
    expect(actorPaginator).toHaveProperty('from')
    expect(actorPaginator).toHaveProperty('to')
    expect(actorPaginator).toHaveProperty('total')
    expect(actorPaginator).toHaveProperty('perPage')
    expect(Array.isArray(actorPaginator.data)).toBe(true)
  })

  it('should show an actor', async () => {
    expect.assertions(2)
    repositoryMock.findOneOrFail?.mockReturnValue(testActor)

    await expect(actorService.show(testActor.id)).resolves.toEqual(testActor)
    expect(repositoryMock.findOneOrFail).toHaveBeenCalledWith({
      where: { id: testActor.id }
    })
  })

  it('should store an actor', async () => {
    const dummyId = 56

    repositoryMock.create?.mockReturnValue(testActorDto)
    repositoryMock.save?.mockReturnValue(
      Object.assign(testActorDto, { id: dummyId })
    )

    const storedActor: Actor = await actorService.store(testActorDto)

    expect(storedActor).toHaveProperty('id', dummyId)
  })

  it('should update an actor', async () => {
    repositoryMock.createQueryBuilder?.mockImplementation(
      () => createQueryBuilder
    )
    repositoryMock.create?.mockReturnValue(testActorDto)

    const updatedResult: UpdateResult = await actorService.update(1, testActorDto)

    expect(repositoryMock.create).toHaveBeenCalled()
    expect(repositoryMock.update).toHaveBeenCalled()
  })

  it('should delete an actor', async () => {
    expect.assertions(2)

    const mockDeleteResult = { raw: 'mock data delete result' }

    repositoryMock.delete?.mockReturnValue(mockDeleteResult)
    repositoryMock.findOneOrFail?.mockReturnValue(testActor)

    await expect(actorService.destroy(testActor.id)).resolves.toEqual(
      mockDeleteResult
    )
    expect(repositoryMock.delete).toHaveBeenCalledWith(testActor.id)
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
