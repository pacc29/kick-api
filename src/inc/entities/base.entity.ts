import { Column, PrimaryGeneratedColumn } from "typeorm";
import { state } from "../enums/state.enum";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: state.STATE_ENABLED })
    state: number;
}