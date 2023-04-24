import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUpdateMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsArray()
  @IsOptional()
  actorIds: number[]
}
