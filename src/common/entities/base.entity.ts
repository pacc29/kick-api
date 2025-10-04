import { Column, PrimaryGeneratedColumn } from "typeorm";
import { state } from "../enums/state.enum";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'tinyint', default: state.STATE_ENABLED })
    state: state;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', onUpdate: 'CURRENT_TIMESTAMP', nullable: true, default: null })
    updated_at: Date;
}