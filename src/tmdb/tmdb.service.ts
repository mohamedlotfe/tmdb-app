import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { MovieService } from '../movie/movie.service';
import { TmdbGenre, TmdbPaginatedResponse } from './interfaces/tmdb.interfaces';

@Injectable()
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly logger = new Logger(TmdbService.name);

  constructor(private readonly movieService: MovieService) {
    console.log('TMDB Service initialized', this.apiKey);
  }

  /**
   * Fetch movie genres from TMDB
   * @returns Array of TMDB genre objects
   */
  async getGenres(): Promise<TmdbGenre[]> {
    try {
      const response = await axios.get<{ genres: TmdbGenre[] }>(
        `${this.baseUrl}/genre/movie/list`,
        { params: { api_key: this.apiKey } },
      );
      return response.data.genres;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('TMDB API Error:', error.message);
        throw new Error(`TMDB API Error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }
  /**
   * Get popular movies from TMDB with pagination
   * @param page Page number (default: 1)
   * @returns Paginated movie results
   */
  async getPopularMovies(page = 1): Promise<TmdbPaginatedResponse> {
    try {
      const response = await axios.get<TmdbPaginatedResponse>(`${this.baseUrl}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('TMDB API Error:', error.message);
        throw new Error(`TMDB API Error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }
  /**
   * Daily cron job to sync TMDB data with local database
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncMovies(): Promise<void> {
    try {
      this.logger.log('Starting TMDB sync...');
      const genres = await this.getGenres();
      const genreMap = new Map(genres.map((g) => [g.id, g.name]));

      let page = 1;
      let totalPages = 1;

      do {
        const response = await this.getPopularMovies(page);
        totalPages = response.total_pages;
        this.logger.log(`Syncing page ${page} of ${totalPages}`);
        await Promise.all(
          response.results.map(async (tmdbMovie) => {
            const movieData = {
              tmdbId: tmdbMovie.id,
              title: tmdbMovie.title,
              overview: tmdbMovie.overview,
              releaseDate: new Date(tmdbMovie.release_date),
              genres: tmdbMovie.genre_ids
                .map((id) => genreMap.get(id))
                .filter((genre): genre is string => genre !== undefined),
              averageRating: tmdbMovie.vote_average,
              posterPath: tmdbMovie.poster_path,
            };

            await this.movieService.upsertMovie(movieData);
          }),
        );

        page++;
      } while (page <= totalPages);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
