import { IsNumber, Min, Max } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @Min(3)
  @Max(15)
  rows: number;

  @IsNumber()
  @Min(3)
  @Max(15)
  cols: number;

  @IsNumber()
  @Min(3)
  @Max(15)
  diamonds: number;
}
