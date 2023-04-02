import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "../users/users.model";
import {Role} from "../roles/roles.model";

@Entity()
export class Profiles {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", nullable: false})
    name: string

    @Column({type: "varchar", nullable: false})
    surname: string

    @Column({type: "numeric", nullable: true})
    number: number

    @OneToOne(() => Users, (users) => users)
    @JoinColumn()
    user: Users

}