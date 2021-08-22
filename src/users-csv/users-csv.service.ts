import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Connection, Repository } from 'typeorm';
import { Team } from '../teams/team.entity';
import { validate } from 'class-validator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class UsersCsvService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly connection: Connection,
  ) {}

  async create(stream) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      stream
        .on('data', async (data) => {
          try {
            stream.pause();
            if (await this.userRepository.findOne({ email: data['email'] })) {
              return;
            }

            const userDto = setupUserDto(data);

            const userValidation = await validate(userDto);
            if (userValidation.length) {
              return;
            }

            const userData = <any>userDto;

            userData.team =
              (await queryRunner.manager.findOne(Team, {
                name: data['team'],
              })) ?? this.teamRepository.create({ name: data['team'] });

            const user = this.userRepository.create(userData);
            await queryRunner.manager.save(user);
          } catch (e) {
            await queryRunner.rollbackTransaction();
            stream.destroy();
            console.log(e);
          } finally {
            stream.resume();
          }
        })
        .on('end', async () => {
          await queryRunner.commitTransaction();
        })
        .on('error', async (error) => {
          await queryRunner.rollbackTransaction();
          stream.destroy();
          console.log(error);
        });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
    }

    function setupUserDto(data) {
      const userDto = new CreateUserDto();
      userDto.firstName = data['first name'];
      userDto.lastName = data['last name'] || null;
      userDto.email = data['email'];
      userDto.roleDescription = data['role description'] || null;

      return userDto;
    }
  }
}
