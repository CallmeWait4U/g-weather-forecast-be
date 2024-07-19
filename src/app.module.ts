import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'libs/database.module';
import { EmailModule } from 'libs/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { jwtConfig } from './jwt.config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConfig.access,
      signOptions: { expiresIn: jwtConfig.expiresIn.access },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    DatabaseModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
