import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('User', () => {
    it('should create a user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email: 'ndp@the.best', password: '123456' })
        .expect(201);
    });

    it('should find a user', async () => {
      const userDto = { email: 'ndp@the.crazy', password: '123456' };

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(userDto)
        .expect(201)
        .then((res) => res.body);

      const res = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(res.body).toEqual({
        id: expect.any(Number),
        name: null,
        email: userDto.email,
        Post: expect.arrayContaining([]),
        Profile: expect.objectContaining({
          id: expect.any(Number),
          userId: expect.any(Number),
        }),
      });
    });
  });

  describe('Auth', () => {
    it('should sign up', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'ndp@the.biggest', password: '123456' })
        .expect(201);

      expect(res.body).toEqual({ access_token: expect.any(String) });
    });

    it('should sign in', async () => {
      const user = { email: 'ndp@the.prettiest', password: '123456' };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(user);

      expect(res.body).toEqual({ access_token: expect.any(String) });
    });
  });
});
