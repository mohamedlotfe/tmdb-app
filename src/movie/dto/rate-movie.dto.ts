/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, Min, Max, IsNumber } from 'class-validator';

export class RateMovieDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
}
