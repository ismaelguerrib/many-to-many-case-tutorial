import { CaseProperty } from '@casejs/nest-library'
import { faker } from '@faker-js/faker'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Actor } from '../actor/actor.entity'

@Entity({ name: 'movies' })
export class Movie {
  public static searchableFields: string[] = ['name']
  public static displayName: string = 'name'

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @Column('varchar', {})
  @CaseProperty({
    seed: (index: number) => faker.music.songName()
  })
  name: string

  @ManyToMany((type) => Actor, (actor) => actor.movies)
  actors: Actor[]

  // Calculated column for list display.
  actorNames?: string

  // Calculated column for create-edit form.
  actorIds?: number[]
}
