import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { SyncMoviesCommand } from './sync.command';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [TmdbService, SyncMoviesCommand],
})
export class TmdbModule {}
