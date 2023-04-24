import { DataSource } from 'typeorm'

import { Actor } from '../../resources/actor/actor.entity'

export class ActorSeeder {
  dataSource: DataSource
  count: number

  constructor(dataSource: DataSource, count: number) {
    this.dataSource = dataSource
    this.count = count
  }

  async seed(): Promise<Actor[]> {
    console.log('\x1b[35m', '[] Seeding actors...')

    const properties: string[] = this.dataSource
      .getMetadata(Actor)
      .ownColumns.map((column) => column.propertyName)

    const saveActorPromises: Promise<Actor>[] = Array.from(Array(this.count)).map(
      async (_value, index: number) => {
        return this.dataSource.manager.save(await this.new(properties, index))
      }
    )

    return Promise.all(saveActorPromises).then((res) => {
      return res
    })
  }

  private new(properties: string[], index): Promise<Actor> {
    const actorModel = this.dataSource.manager.create(Actor, {})

    properties.forEach((property: string) => {
      const seederFunction = Reflect.getMetadata(`${property}:seed`, actorModel)
      if (seederFunction) {
        actorModel[property] = seederFunction(index)
      }
    })

    return Promise.resolve(actorModel)
  }
}
