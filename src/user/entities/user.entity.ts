import { BaseEntity } from "src/inc/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @Column({ nullable: false, length: 50 })
    email: string;

    @Column({ nullable: false })
    password: string
}