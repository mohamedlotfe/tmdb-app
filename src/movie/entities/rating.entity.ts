import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from '../../user/entities';

@Entity()
export class Rating {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  movieId: number;

  @Column('float')
  rating: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
