import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('tokens')
@Index(['state', 'expiration_date', 'created_at'])
export class Token extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  token: string;

  @Column({ type: 'datetime', nullable: false })
  expiration_date: Date;
}
