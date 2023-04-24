import { AuthService, SelectOption } from '@casejs/nest-library'
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateResult } from 'typeorm'

import { CreateUpdateActorDto } from '../dtos/create-update-actor.dto'
import { ActorController } from '../actor.controller'
import { Actor } from '../actor.entity'
import { ActorService } from '../actor.service'

describe('ActorController', () => {
  let actorController: ActorController
  let actorService: ActorService

  const testActor = {
    id: 1,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorController,
        {
          provide: ActorService,
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
    actorController = module.get<ActorController>(ActorController)
    actorService = module.get<ActorService>(ActorService)
  })

  describe('ActorController', () => {
    it('should list actors', async () => {
      expect.assertions(2)
      const result: Actor[] = [testActor] as any[]

      jest.spyOn(actorService, 'index').mockReturnValue(Promise.resolve(result))

      expect(await actorController.index()).toBe(result)
      expect(actorService.index).toHaveBeenCalled()
    })

    it('should get a list of select options', async () => {
      expect.assertions(3)
      const result: Actor[] = [testActor] as any[]

      jest.spyOn(actorService, 'index').mockReturnValue(Promise.resolve(result))

      const selectOptions: SelectOption[] =
        await actorController.listSelectOptions()

      expect(Array.isArray(selectOptions)).toBe(true)
      expect(selectOptions[0]).toHaveProperty('label')
      expect(selectOptions[0]).toHaveProperty('value')
    })

    it('should show an actor', async () => {
      expect.assertions(2)
      const result: Actor = testActor as Actor

      jest.spyOn(actorService, 'show').mockReturnValue(Promise.resolve(result))

      expect(await actorController.show(testActor.id)).toBe(result)
      expect(actorService.show).toHaveBeenCalledWith(testActor.id)
    })

    it('should store an actor', async () => {
      expect.assertions(2)

      const testActorDto: CreateUpdateActorDto = Object.assign(testActor, { roleId: 1 })

      jest
        .spyOn(actorService, 'store')
        .mockReturnValue(Promise.resolve(testActor as any))

      expect(await actorService.store(testActorDto)).toBe(testActor)
      expect(actorService.store).toHaveBeenCalledWith(testActor)
    })

    it('should update an actor', async () => {
      expect.assertions(2)
      const result: UpdateResult = { raw: 'dummy', generatedMaps: [] }

      const testActorDto: CreateUpdateActorDto = Object.assign(testActor, { roleId: 1 })

      jest.spyOn(actorService, 'update').mockReturnValue(Promise.resolve(result))

      expect(await actorService.update(testActor.id, testActorDto)).toBe(result)
      expect(actorService.update).toHaveBeenCalledWith(testActor.id, testActor)
    })

    it('should delete an actor', async () => {
      jest.spyOn(actorService, 'destroy')

      await actorController.delete(testActor.id)

      expect(actorService.destroy).toBeCalledWith(testActor.id)
    })
  })
})
