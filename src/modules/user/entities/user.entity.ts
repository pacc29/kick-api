import { Exclude } from "class-transformer";
import { BaseEntity } from "src/common/entities/base.entity";
import { hashPassword } from "src/common/helpers/password";
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

    @Column({ nullable: false, select: false })
    @Exclude()
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await hashPassword(this.password);
    }
}