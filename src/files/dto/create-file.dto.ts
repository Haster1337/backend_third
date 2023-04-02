export class CreateFileDto {
    readonly file: string
    readonly essenceId: number | null
    readonly essenceTable: string | null
}