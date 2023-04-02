import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TextGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 150, nullable: false, unique: true})
    uniqueName: string

    @Column({type: "varchar", length: 150, nullable: false})
    name: string

    @Column({type: "text", nullable: false, unique: true}) // уникальное название файла, по которому мы будем доставать файл из static
    image: string

    @Column({type: "text", nullable: false})
    text: string

    @Column({type: "text", nullable: false})
    group: string

}