import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities';
import { UserService } from '../user/user.service';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private userService: UserService,
  ) {}

  async upsertMovie(movieData: Partial<Movie>): Promise<Movie> {
    const existing = await this.movieRepository.findOne({
      where: { tmdbId: movieData.tmdbId },
    });

    if (existing) {
      await this.movieRepository.update(existing.id, movieData);
      const updatedMovie = await this.movieRepository.findOneBy({ id: existing.id });
      if (!updatedMovie) {
        throw new Error('Failed to update movie');
      }
      return updatedMovie;
    }

    const movie = this.movieRepository.create(movieData);
    return this.movieRepository.save(movie);
  }

  async rateMovie(userId: number, movieId: number, rating: number): Promise<Movie | void> {
    // Check if the movie exists
    const movie = await this.movieRepository.findOne({
      where: { tmdbId: movieId },
      relations: ['ratings'],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    // Find existing rating (if any)
    const existingRating = movie.ratings.find((r) => r.userId === userId);

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await this.ratingRepository.save(existingRating);
    } else {
      // Create new rating
      const newRating = this.ratingRepository.create({
        userId,
        movieId: movie.id, // Ensure this matches the primary key of the movie entity
        rating,
      });

      // Save the new rating
      await this.ratingRepository.save(newRating);

      // Add the new rating to the movie's ratings array
      movie.ratings.push(newRating);
    }

    // Update average rating
    const avg: { average: string } = (await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating)', 'average')
      .where('rating.movieId = :movieId', { movieId: movie.id }) // Use movie.id here
      .getRawOne()) || { average: '0' };

    movie.averageRating = parseFloat(avg.average);
    await this.movieRepository.save(movie);

    return movie;
  }

  async findAll(genre?: string, search?: string, page = 1, limit = 10): Promise<Movie[]> {
    const query = this.movieRepository.createQueryBuilder('movie');

    if (genre) {
      query.andWhere(':genre = ANY(movie.genres)', { genre });
    }

    if (search) {
      query.andWhere('movie.title ILIKE :search', { search: `%${search}%` });
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOneBy(movieId: number): Promise<Movie | null> {
    const movie = await this.movieRepository.findOne({
      where: { tmdbId: movieId },
      relations: ['ratings'],
    });
    return movie;
  }

  async toggleWatchlist(user: User, movieId: number): Promise<{ added: boolean }> {
    return this.userService.addToWatchlist(user, movieId);
  }
}
