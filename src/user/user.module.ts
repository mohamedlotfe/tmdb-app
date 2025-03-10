import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie/entities';
import { User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
