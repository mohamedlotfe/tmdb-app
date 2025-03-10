import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  try {
    await CommandFactory.run(AppModule, { logger: console });
  } catch (error: unknown) {
    console.error('Error executing command:', error);
    process.exit(1);
  }
}

bootstrap();
