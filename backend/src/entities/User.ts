import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBet } from './UserBet';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ unique: true })
  email!: string;

  @Column('decimal', { precision: 18, scale: 8 })
  balance!: number;

  @Column()
  password!: string;

  @Column({ nullable: true })
  jwt_token?: string;

  @Column({ nullable: true })
  last_bet?: Date;

  @Column({ nullable: true })
  last_login?: Date;

  @OneToMany(() => UserBet, userBet => userBet.user)
  bets!: UserBet[];
}