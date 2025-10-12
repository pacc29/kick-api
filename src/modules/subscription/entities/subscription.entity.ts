import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Unique(['user_id', 'broadcaster_id'])
@Entity({ name: 'subscriptions' })
export class Subscription extends BaseEntity {
  @Column({ nullable: false, type: 'integer' })
  user_id: number;

  @Column({ nullable: false, type: 'integer' })
  broadcaster_id: number;
}
