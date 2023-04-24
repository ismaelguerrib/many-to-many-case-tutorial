import { DataSource } from 'typeorm'

import { Movie } from '../../resources/movie/movie.entity'

export class MovieSeeder {
  dataSource: DataSource
  count: number

  constructor(dataSource: DataSource, count: number) {
    this.dataSource = dataSource
    this.count = count
  }

  async seed(): Promise<Movie[]> {
    console.log('\x1b[35m', '[] Seeding movies...')

    const properties: string[] = this.dataSource
      .getMetadata(Movie)
      .ownColumns.map((column) => column.propertyName)

    const saveMoviePromises: Promise<Movie>[] = Array.from(Array(this.count)).map(
      async (_value, index: number) => {
        return this.dataSource.manager.save(await this.new(properties, index))
      }
    )

    return Promise.all(saveMoviePromises).then((res) => {
      return res
    })
  }

  private new(properties: string[], index): Promise<Movie> {
    const movieModel = this.dataSource.manager.create(Movie, {})

    properties.forEach((property: string) => {
      const seederFunction = Reflect.getMetadata(`${property}:seed`, movieModel)
      if (seederFunction) {
        movieModel[property] = seederFunction(index)
      }
    })

    return Promise.resolve(movieModel)
  }
}
