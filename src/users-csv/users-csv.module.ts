import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { UsersCsvController } from './users-csv.controller';
import { UsersCsvService } from './users-csv.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team])],
  controllers: [UsersCsvController],
  providers: [UsersCsvService],
  exports: [UsersCsvService],
})
export class UsersCsvModule {}
