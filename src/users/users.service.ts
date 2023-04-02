import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "./users.model";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {Role} from "../roles/roles.model";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private rolesService: RolesService,
        ) {}


    async createUser(userDto: CreateUserDto){ // создаем юзера
        const user = this.usersRepository.create(userDto);
        const role = await this.rolesService.getRoleByValue("User"); // достаем роль юзера
        user.role = role; // по умолчанию всем пользователям даем эту роль
        await this.usersRepository.save(user); // сохраняем изменения в бд
        return user;
    }

    async getUserByEmail(email: string){ // получить пользователя по емейлу
        const user = await this.usersRepository.findOne({
            where: {email: email},
            relations: ["role"]
        })
        return user;
    }

    async getUserByPrimaryKey(id: number){
        const user = await this.usersRepository.findOne({
            where: {userId: id},
            relations: ["role"]
        }) // получаем юзера по айдишнику и его роль
        return user;
    }

    async updateRole(user: Users, role: Role){
        user.role = role; // меняем роль у пользователя
        await this.usersRepository.save(user); // сохраняем данные
        return user; // возвращаем пользователя
    }

    async deleteProfile(user) {
        await this.usersRepository.remove(user);
    }

    async saveInRepository(dto: CreateUserDto){
        await this.usersRepository.save(dto);

        return dto;
    }
}
