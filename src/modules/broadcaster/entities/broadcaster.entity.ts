import { state } from 'src/common/enums/state.enum';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'broadcasters' })
@Unique(['id', 'slug'])
export class Broadcaster {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  slug: string;

  @Column({ type: 'boolean', default: state.STATE_ENABLED })
  state: state;

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
