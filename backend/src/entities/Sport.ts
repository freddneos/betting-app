import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './Event';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  sport_id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column()
  emoji!: string;

  @Column()
  slug!: string;

  @OneToMany(() => Event, event => event.sport)
  events!: Event[];
}