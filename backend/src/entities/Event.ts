import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column()
  event_name: string;

  @Column("decimal", { precision: 5, scale: 2 })
  odds: number;
}

