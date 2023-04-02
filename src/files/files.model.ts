import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Files {
    @PrimaryGeneratedColumn()
    id: number

    // прочитал, что лучше не хранить данные в бд, в особенности картинки, поэтому предлагаю
    // хранить уникальное название файла, которое будем доставать из папки static
    @Column({type: "text", nullable: false})
    file: string

    @Column({type: "numeric", nullable: true})
    essenceId: number

    @Column({type: "varchar", length: 150, nullable: true})
    essenceTable: string

    @CreateDateColumn()
    created_at: Date
}