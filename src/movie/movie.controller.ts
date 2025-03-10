import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/Auth.guard';
import { CurrentUser } from '../common/deco/user.decorator';
import { User } from '../user/entities';
import { RateMovieDto } from './dto/rate-movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
@UseInterceptors(CacheInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({ summary: 'List movies with filters' })
  @ApiResponse({ status: 200, description: 'List of movies' })
  @ApiQuery({ name: 'genre', required: false, type: String, description: 'Filter by genre' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for movie titles',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  findAll(
    @Query('genre') genre?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.movieService.findAll(genre, search, page, limit);
  }

  @Post(':id/rate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token') // Must match name in DocumentBuilder
  @ApiOperation({
    summary: 'Rate a movie',
    description: "Creates or updates a user's rating for a movie (1-5 scale)",
  })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    schema: {
      example: {
        message: 'Rating updated successfully',
        movieId: 123,
        userId: 456,
        newRating: 4,
        averageRating: 4.2,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid rating value' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing/invalid token' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async rateMovie(
    @Param('id') tmdbId: number,
    @Body() rateMovieDto: RateMovieDto,
    @CurrentUser() user: User,
  ) {
    const { rating } = rateMovieDto;
    if (!rating) {
      return { message: 'Invalid rating value' };
    }
    // Update rating
    const movie = await this.movieService.rateMovie(user.id, tmdbId, rating);

    return {
      message: 'Rating updated successfully',
      movieId: tmdbId,
      userId: user.id,
      newRating: rating,
      averageRating: movie?.averageRating,
    };
  }
  @Post(':id/watchlist')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Add or remove a movie from the user's watchlist",
    description: "Toggles the movie in the user's watchlist (add/remove)",
  })
  @ApiResponse({
    status: 200,
    description: 'Watchlist updated successfully',
    schema: {
      example: {
        message: 'Movie added to watchlist',
        movieId: 123,
        userId: 456,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing/invalid token' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async toggleWatchlist(@Param('id') movieId: number, @CurrentUser() user: User) {
    const result = await this.movieService.toggleWatchlist(user, movieId);

    return {
      message: result.added ? 'Movie added to watchlist' : 'Movie removed from watchlist',
      movieId,
      userId: user.id,
    };
  }
}
