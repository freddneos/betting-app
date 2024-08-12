import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './Event';
import { User } from './User';

@Entity()
export class UserBet {
  @PrimaryGeneratedColumn()
  bet_id!: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })  
  event!: Event;

  @ManyToOne(() => User, user => user.bets)
  @JoinColumn({ name: 'user_id' }) 
  user!: User;

  @Column('decimal', { precision: 18, scale: 8 })
  amount!: number;
}