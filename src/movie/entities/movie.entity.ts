import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../../user/entities';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tmdbId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  posterPath: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column('text', { array: true })
  genres: string[];

  @Column('float', { nullable: true })
  averageRating: number;

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @ManyToMany(() => User, (user) => user.watchlist)
  watchlists: User[];
}
