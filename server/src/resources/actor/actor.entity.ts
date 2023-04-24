import { CaseProperty } from '@casejs/nest-library'
import { faker } from '@faker-js/faker'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Movie } from '../movie/movie.entity'

@Entity({ name: 'actors' })
export class Actor {
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
    seed: () => faker.name.fullName()
  })
  name: string

  @ManyToMany((type) => Movie, (movie) => movie.actors, { cascade: true })
  @JoinTable({ name: 'actor_movie' })
  movies: Movie[]

  // Calculated column for list display.
  movieNames?: string
}
