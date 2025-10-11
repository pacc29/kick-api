import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Unique } from 'typeorm';

@Unique('user_id_broadcaster_user_id_unique', [
  'user_id',
  'broadcaster_user_id',
])
@Entity({ name: 'subscriptions' })
export class Subscription extends BaseEntity {
  @Column({ nullable: false, type: 'integer' })
  user_id: number;

  @Column({ nullable: false, type: 'integer' })
  broadcaster_user_id: number;
}
