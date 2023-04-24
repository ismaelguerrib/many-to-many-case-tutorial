import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUpdateActorDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsArray()
  @IsOptional()
  movieIds: number[]
}
