import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {CreateProfileDto} from "../profiles/dto/create-profile.dto";
import {ProfilesService} from "../profiles/profiles.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {Profiles} from "../profiles/profiles.model";
import {UsersService} from "../users/users.service";
import {CreateRoleDto} from "../roles/dto/create-role.dto";

@Injectable()
export class AuthService {

    constructor(
        private profileService: ProfilesService,
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user.email, user.userId, user.role);
    }

    async registration(profileDto: CreateProfileDto) {
        const candidate = await this.usersService.getUserByEmail(profileDto.email); // получаем пользователя с таким email
        if(candidate){ // если такой пользователь существует выкидываем ошибку
            throw new HttpException("Пользователь с таким email уже существует", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(profileDto.password, 5); // хешируем пароль
        const profile = await this.profileService.createProfile({...profileDto, password: hashPassword}); // создаем профиль и пользователя
        return this.generateToken(profile.user.email, profile.user.userId, profile.user.role); // генерируем токен
    }

    private async generateToken(email: string, id: number, role: CreateRoleDto) {
        const payload = {email: email, id: id, roles: role}; // генерируем токен на основании емейла, айди и роли
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if(user.password === userDto.password){ // случай для проверки создателя, т.к. мы расхешировать пароль не можем, то
            return user;
        }
        if(user && passwordEquals){
            return user;
        }
        throw new UnauthorizedException({message: "Некорректный email или пароль"});
    }
}
