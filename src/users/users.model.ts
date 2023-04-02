import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Profiles} from "../profiles/profiles.model";
import {Role} from "../roles/roles.model";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({type: "text", nullable: false, unique: true})
    email: string

    @Column({type: "text", nullable: false})
    password: string

    @ManyToOne(() => Role, (role) => role)
    role: Role
}