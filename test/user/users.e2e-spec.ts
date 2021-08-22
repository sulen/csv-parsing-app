import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import { TeamsModule } from '../../src/teams/teams.module';
import { Connection, EntityManager, QueryRunner, Repository } from 'typeorm';
import { User } from '../../src/users/user.entity';
import { userStub } from './stubs/user.stub';

describe('User e2e', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TeamsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5434,
          username: 'postgres',
          password: 'jWsn7340vDSw',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    userRepository = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();
    await app.init();

    const dbConnection = moduleFixture.get(Connection);
    const manager = moduleFixture.get(EntityManager);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    queryRunner = manager.queryRunner =
      dbConnection.createQueryRunner('master');
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('Get all [GET /]', () => {
    it('returns correct shape when there are no items in the database', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = jasmine.objectContaining({
            total: 0,
            data: [],
          });

          expect(body).toEqual(expectedResponse);
          expect(body.data).toEqual([]);
        });
    });
    it('returns correct shape when there is one item in the database', () => {
      const stub = userStub();
      const user = userRepository.create(stub);
      userRepository.save(user);

      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = jasmine.objectContaining({
            total: 1,
            data: jasmine.arrayContaining([jasmine.objectContaining(stub)]),
          });

          expect(body).toEqual(expectedResponse);
          expect(body.data.length).toEqual(1);
        });
    });
    it('returns correct shape when there is multiple items in the database', () => {
      const stubs = [...Array(5)].map(userStub);
      const users = stubs.map((stub) => userRepository.create(stub));
      users.forEach((user) => userRepository.save(user));

      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = jasmine.objectContaining({
            total: 5,
            data: jasmine.arrayContaining(
              stubs.map((stub) => jasmine.objectContaining(stub)),
            ),
          });

          expect(body).toEqual(expectedResponse);
          expect(body.data.length).toEqual(5);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
