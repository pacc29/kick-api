import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { State } from '../enums/state.enum';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: State.STATE_ENABLED })
  state: State;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    default: null,
  })
  updated_at: Date;
}
