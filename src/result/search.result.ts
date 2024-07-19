import { Expose } from 'class-transformer';

export class ForecastDay {
  @Expose()
  date: Date;
  @Expose()
  temp: string;
  @Expose()
  wind: string;
  @Expose()
  humi: string;
  @Expose()
  conditionIcon: string;
}

export class SearchResult {
  @Expose()
  cityName: string;
  @Expose()
  date: Date;
  @Expose()
  temp: string;
  @Expose()
  wind: string;
  @Expose()
  humi: string;
  @Expose()
  conditionText: string;
  @Expose()
  conditionIcon: string;
  @Expose()
  forecastDays: ForecastDay[];
}
