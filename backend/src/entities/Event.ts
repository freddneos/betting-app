import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sport } from './Sport';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  event_id!: number;

  @Column()
  event_name!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  odds!: number;

  @ManyToOne(() => Sport, sport => sport.events)
  @JoinColumn({ name: 'sport_id' })  // Explicitly define the foreign key column name
  sport!: Sport;
}
