import { BaseEntity } from "src/inc/entities/base.entity";
import { hashPassword } from "src/inc/helpers/password";
import { BeforeInsert, Column, Entity } from "typeorm";

export enum UserProperties {
    MAX_EMAIL_LENGTH = 50,
    PASSWORD_MAX_LENGTH = 15,
    PASSWORD_MIN_LENGTH = 8
}

@Entity()
export class User extends BaseEntity {
    @Column({ nullable: false, length: 50 })
    email: string;

    @Column({ nullable: false })
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await hashPassword(this.password);
    }
}