import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaginationService } from '@casejs/nest-library'

import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'
import { Actor } from './actor.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Actor])],
  controllers: [ActorController],
  providers: [ActorService, PaginationService],
})
export class ActorModule {}
