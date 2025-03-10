import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Movie } from '../movie/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['ratings', 'watchlist'],
    });
  }

  async addToWatchlist(user: User, movieId: number): Promise<{ added: boolean }> {
    // Find the movie
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    // Check if the movie is already in the watchlist
    const isInWatchlist = user.watchlist.some((m) => m.id === movie.id);

    if (isInWatchlist) {
      // Remove the movie from the watchlist
      user.watchlist = user.watchlist.filter((m) => m.id !== movie.id);
      await this.userRepository.save(user);
      return { added: false };
    } else {
      // Add the movie to the watchlist
      user.watchlist.push(movie);
      await this.userRepository.save(user);
      return { added: true };
    }
  }

  async getWatchlist(userId: number): Promise<Movie[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['watchlist'],
    });
    return user?.watchlist || [];
  }
}
