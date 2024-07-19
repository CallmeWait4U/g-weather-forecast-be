import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({ example: 'a@gmail.com', type: String })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;
}
