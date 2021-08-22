import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { skip, take } = paginationQuery;

    const [data, total] = await this.userRepository.findAndCount({
      relations: ['team'],
      skip,
      take: take ?? 10,
    });

    return { total, data };
  }
}
