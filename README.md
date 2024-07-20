# G Weather Forecast BE

Link project: https://g-weather-forecast-be-fecs.onrender.com/

Swagger API: https://g-weather-forecast-be-fecs.onrender.com/docs

# Run project locally

First, install packages:
```bash
$ npm install
```
Then, generate Prisma Client code or to re-generate Prisma Client code:
```bash
$ npm prisma generate
```

Finally, start project:
```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

# Description

This project is implemented using the [Nest](https://github.com/nestjs/nest) framework and used [Render](render.com) for deployment.

Techniques used in the project:
- Database: PostgreSQL.
- Prisma ORM to read and write to database.
- Use Swagger to build RESTful API documentation.
- Use Axios to get weather information from [Weather API](https://www.weatherapi.com).
- Use Mailer to send notification emails to users.

# Contributor
Bui Tran Nhat Thanh.

Thanks for watching and hope you have a good day.
