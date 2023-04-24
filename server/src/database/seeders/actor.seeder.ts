import { faker } from '@faker-js/faker'
import { DataSource } from 'typeorm'

import { Actor } from '../../resources/actor/actor.entity'

export class ActorSeeder {
  dataSource: DataSource
  count: number
  movieCount: number

  constructor(dataSource: DataSource, count: number, movieCount: number) {
    this.dataSource = dataSource
    this.count = count
    this.movieCount = movieCount
  }

  async seed(): Promise<Actor[]> {
    console.log('\x1b[35m', '[] Seeding actors...')

    const properties: string[] = this.dataSource
      .getMetadata(Actor)
      .ownColumns.map((column) => column.propertyName)

    const saveActorPromises: Promise<Actor>[] = Array.from(
      Array(this.count)
    ).map(async (_value, index: number) => {
      return this.dataSource.manager.save(await this.new(properties, index))
    })

    return Promise.all(saveActorPromises).then((res) => {
      return res
    })
  }

  private new(properties: string[], index): Promise<Actor> {
    // Attach between 0 and 2 movies per actor.
    const movieRelationships = faker.datatype.number({
      min: 0,
      max: 2
    })

    // For each relationship, we add a random movie.
    let movies = []
    for (let i = 0; i < movieRelationships; i++) {
      movies.push({
        id: faker.datatype.number({
          min: 1,
          max: this.movieCount
        })
      })
    }

    const actorModel = this.dataSource.manager.create(Actor, {
      movies
    })

    properties.forEach((property: string) => {
      const seederFunction = Reflect.getMetadata(`${property}:seed`, actorModel)
      if (seederFunction) {
        actorModel[property] = seederFunction(index)
      }
    })

    return Promise.resolve(actorModel)
  }
}
