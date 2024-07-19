import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ example: 'a@gmail.com', type: String })
  @IsString()
  @IsNotEmpty()
  email: string;
}
