import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchDTO {
  @ApiProperty({ example: 'London', type: String })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ required: false, example: 'a@gmail.com', type: String })
  @IsString()
  @IsOptional()
  email?: string;
}
