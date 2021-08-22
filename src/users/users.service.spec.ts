import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Team } from '../teams/team.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findAndCount: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Team),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    describe('when there are no items', () => {
      it('should return an empty array', async () => {
        userRepository.findAndCount.mockReturnValue([[], 0]);
        const users = await service.findAll({});

        expect(users).toEqual({
          total: 0,
          data: [],
        });
      });
    });
    describe('when there are items', () => {
      it('should return an item inside the array', async () => {
        userRepository.findAndCount.mockReturnValue([[{}], 1]);
        const users = await service.findAll({});

        expect(users).toEqual({
          total: 1,
          data: [{}],
        });
      });
    });
  });
});
