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
  public static searchableFields: string[] = ['id']
  public static displayName: string = 'id'

  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  @Column('varchar', {})
  @CaseProperty({
    seed: (index: number) => faker.random.word()
  })
  name: string

  @ManyToMany((type) => Actor, (actor) => actor.movies)
  actors: Actor[]
}