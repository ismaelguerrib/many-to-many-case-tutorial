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

import { ActorService } from './actor.service'
import { Actor } from './actor.entity'
import { CreateUpdateActorDto } from './dtos/create-update-actor.dto'

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  @Permission('browseActors')
  async index(
    @Query('actorIds') actorIds?: string[],
    @Query('movieIds') movieIds?: number[],
    @Query('page') page?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderByDesc', ParseBoolPipe) orderByDesc?: boolean,
    @Query('withoutPagination', ParseBoolPipe) withoutPagination?: boolean,
    @Query('toXLS', ParseBoolPipe) toXLS?: boolean
  ): Promise<Paginator<Actor> | Actor[] | string> {
    return this.actorService.index({
      actorIds,
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
    const actors: Actor[] = (await this.actorService.index({
      withoutPagination: true,
      orderBy,
      orderByDesc
    })) as Actor[]

    return actors.map((actor: Actor) => ({
      label: `actor ${actor.id}`,
      value: actor.id
    }))
  }

  @Get('/:id')
  @Permission('readActors')
  async show(@Param('id', ParseIntPipe) id: number): Promise<Actor> {
    return this.actorService.show(id)
  }

  @Post()
  @Permission('addActors')
  async store(@Body() actorDto: CreateUpdateActorDto): Promise<Actor> {
    return await this.actorService.store(actorDto)
  }

  @Put('/:id')
  @Permission('editActors')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actorDto: CreateUpdateActorDto
  ): Promise<UpdateResult> {
    return await this.actorService.update({ id }, actorDto)
  }

  @Delete('/:id')
  @Permission('deleteActors')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.actorService.destroy(id)
  }
}
