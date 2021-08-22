import { Test, TestingModule } from '@nestjs/testing';
import { UsersCsvService } from './users-csv.service';
import { createMockRepository, MockRepository } from '../../test/common';
import { Connection } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

describe('UsersCsvService', () => {
  let service: UsersCsvService;
  let userRepository: MockRepository;
  let teamRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersCsvService,
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

    service = module.get<UsersCsvService>(UsersCsvService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
    teamRepository = module.get<MockRepository>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
