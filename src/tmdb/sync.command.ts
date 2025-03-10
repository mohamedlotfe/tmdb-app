import { Command, CommandRunner } from 'nest-commander';
import { TmdbService } from '../tmdb/tmdb.service';
import { Injectable, Logger } from '@nestjs/common';

@Command({ name: 'sync:movies' })
@Injectable()
export class SyncMoviesCommand extends CommandRunner {
  private readonly logger = new Logger(SyncMoviesCommand.name);

  constructor(private readonly tmdbService: TmdbService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    try {
      this.logger.log('CLI Params', passedParams);
      this.logger.log('CLI Options', options);
      this.logger.log('Starting TMDB sync command...');
      await this.tmdbService.syncMovies();
      console.log('✅ TMDB sync completed successfully');
    } catch (error: any) {
      console.error('❌ Sync failed:', (error as Error).message);
      process.exit(1);
    }
  }
}
