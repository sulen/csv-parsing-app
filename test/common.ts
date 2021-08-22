import { Connection, EntityManager, Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingModule } from '@nestjs/testing';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  findAndCount: jest.fn(),
});

export const getTypeOrmModule = () =>
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'jWsn7340vDSw',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
  });

export const setupQueryRunner = (moduleFixture: TestingModule) => {
  const dbConnection = moduleFixture.get(Connection);
  const manager = moduleFixture.get(EntityManager);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (manager.queryRunner = dbConnection.createQueryRunner('master'));
};
