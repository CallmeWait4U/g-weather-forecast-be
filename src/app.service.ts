import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { MailerDTO } from 'interfaces/mailer.dto';
import { PrismaService } from 'libs/database.module';
import { EmailService } from 'libs/email.module';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDTO } from './dto/register.dto';
import { SignUpDTO } from './dto/sign.up.dto';
import { ForecastDay, SearchResult } from './result/search.result';

@Injectable()
export class AppService {
  @Inject()
  private readonly prisma: PrismaService;
  @Inject()
  private readonly emailService: EmailService;

  constructor(private http: HttpService) {}

  async signUp(data: SignUpDTO) {
    const users = await this.prisma.user.findMany({ select: { email: true } });
    if (users.includes({ email: data.email })) {
      throw new HttpException('Email existed', HttpStatus.BAD_REQUEST);
    }
    const userId = uuidv4().toString();
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(data.password, salt);
    await this.prisma.user.create({
      data: {
        id: userId,
        email: data.email,
        password,
        searchedCityList: [],
        registered: false,
      },
    });
    return {
      statusCode: 200,
      message: 'Registered successfully',
    };
  }

  async signIn(data: SignUpDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new HttpException('Wrong Username', HttpStatus.BAD_REQUEST);
    }
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw new HttpException('Wrong Password', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: 200,
      message: 'Login successfully',
      data: {
        email: user.email,
        registered: user.registered,
        searchedList: user.searchedCityList,
      },
    };
  }

  async search(name: string, email?: string): Promise<SearchResult> {
    let data;
    await axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${name}&days=5&aqi=no&alerts=no`,
      )
      .then((res) => {
        data = res.data;
      })
      .catch((error) => {
        throw new HttpException(
          error.response?.data.error.message,
          HttpStatus.BAD_REQUEST,
        );
      });
    const forecast: any[] = data.forecast.forecastday.map((day) => {
      return {
        date: day.date,
        temp: day.day.avgtemp_c,
        wind: day.day.maxwind_mph,
        humi: day.day.avghumidity,
        conditionText: day.day.condition.text,
        conditionIcon: day.day.condition.icon,
      };
    });
    if (email && email !== '') {
      const user = await this.prisma.user.findUnique({ where: { email } });
      const index = user.searchedCityList.findIndex(
        (i) => i === data.location.name,
      );
      if (index !== -1) {
        user.searchedCityList.splice(index, 1);
      }
      user.searchedCityList.unshift(data.location.name);
      await this.prisma.user.update({
        data: { searchedCityList: user.searchedCityList },
        where: { id: user.id },
      });
    }
    return {
      cityName: data.location.name,
      date: forecast[0].date,
      temp: forecast[0].temp,
      wind: forecast[0].wind,
      humi: forecast[0].humi,
      conditionText: forecast[0].conditionText,
      conditionIcon: forecast[0].conditionIcon,
      forecastDays: forecast.splice(1, 4).map((day) => {
        return plainToClass(ForecastDay, day, {
          excludeExtraneousValues: true,
        });
      }),
    };
  }

  async subscribe(query: RegisterDTO) {
    const data = await this.prisma.user.findUnique({
      where: { email: query.email },
    });
    const mailerDto: MailerDTO = {
      recipients: [
        {
          name: data.email,
          address: data.email,
        },
      ],
      subject: 'Register Daily Weather Forecast Information Successfully',
      html: 'Congratulations, you have successfully registered. From today you will receive weather forecast notifications from our website.',
    };
    await this.emailService.sendEmail(mailerDto);
    await this.prisma.user.update({
      data: { registered: true },
      where: { id: data.id },
    });
    return {
      statusCode: 200,
      message: 'Subscribed successfully',
    };
  }

  async unsubscribe(query: RegisterDTO) {
    const data = await this.prisma.user.findUnique({
      where: { email: query.email },
    });
    const mailerDto: MailerDTO = {
      recipients: [
        {
          name: data.email,
          address: data.email,
        },
      ],
      subject: 'Unsubscribe Daily Weather Forecast Information Successfully',
      html: 'You have unsubscribed from receiving weather forecast notifications from our website.',
    };
    await this.emailService.sendEmail(mailerDto);
    await this.prisma.user.update({
      data: { registered: true },
      where: { id: data.id },
    });
    return {
      statusCode: 200,
      message: 'Unsubscribed successfully',
    };
  }
}
