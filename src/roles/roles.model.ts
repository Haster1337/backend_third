import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "../users/users.model";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "text", nullable: false, unique: true})
    value: string

    @Column({type: "text", nullable: false})
    description: string

    @OneToMany(() => Users, (users) => users.role)
    profiles: Users[]

}


