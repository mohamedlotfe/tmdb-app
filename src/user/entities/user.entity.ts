import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Rating, Movie } from '../../movie/entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @ManyToMany(() => Movie, (movie) => movie.watchlists)
  @JoinTable({
    name: 'user_watchlist', // Name of the join table
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'movieId', referencedColumnName: 'id' },
  })
  watchlist: Movie[];
}
