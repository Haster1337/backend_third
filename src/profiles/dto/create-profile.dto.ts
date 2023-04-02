import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateProfileDto {
    @IsString({message: "Должна быть строкой"})
    name: string

    @IsString({message: "Должна быть строкой"})
    surname: string

    @IsNumber({}, {message: "Должно быть числом"})
    number: number

    @IsString({message: "Должна быть строкой"})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string

    @IsString({message: "Должна быть строкой"})
    @Length(4, 16, {message: "Не меньше 4 и не больше 16 символов"})
    readonly password: string
}