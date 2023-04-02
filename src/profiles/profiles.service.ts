import {Injectable} from '@nestjs/common';
import {Profiles} from "./profiles.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AddRoleDto} from "../roles/dto/add-role.dto";
import {RolesService} from "../roles/roles.service";
import * as bcrypt from "bcryptjs";


@Injectable()
export class ProfilesService {

    // инджектим таблицу/репозиторий для изменения дб,
    // сервисы юзера и ролей, чтобы взаимодействовать с их методами
    constructor(
        @InjectRepository(Profiles)
        private profileRepository: Repository<Profiles>,
        private usersService: UsersService,
        private rolesService: RolesService
    ) {
    }

    async createProfile(profileDto: CreateProfileDto) { // создаем профайл пользователя
        const userDto: CreateUserDto = { // достаем дто для user
            email: profileDto.email,
            password: profileDto.password
        }
        const user = await this.usersService.createUser(userDto); // создаем user
        const profile = await this.profileRepository.create({ //создаем профайл
            name: profileDto.name,
            surname: profileDto.surname,
            number: profileDto.number
        });
        profile.user = user; // ссылаемся на юзера
        await this.profileRepository.save(profile); // сохраняем изменения в базу данных
        return profile;
    }


    async getAllProfiles() { // получаем все профили
        const profiles = await this.profileRepository.find({relations: ["user", "user.role"]});
        return profiles;
    }


    async addRole(dto: AddRoleDto) { // добавляем пользователю роль
        const user = await this.usersService.getUserByPrimaryKey(dto.userId); // находим пользователя по айди
        const role = await this.rolesService.getRoleByValue(dto.value); // находим роль по значению
        if (user && role) {
            return await this.usersService.updateRole(user, role); // вызываем функцию внутри юзер сервиса
        }
    }

    async updateProfile(id: number, dto: CreateProfileDto) {
        const profile = await this.getProfileByID(id); // находим профайл по айди
        profile.name = dto.name; // меняем все его поля кроме пароля
        profile.surname = dto.surname;
        profile.number = dto.number;
        profile.user.email = dto.email;

        const hashPassword = await bcrypt.hash(dto.password, 5); // пароль хешируем
        profile.user.password = hashPassword; // сохраняем в юзер
        await this.usersService.saveInRepository(profile.user); // сохраняем в начале юзера, потому что профайл на него ссылается
        await this.profileRepository.save(profile); // затем сохраняем сам профайл
        return profile
    }

    async deleteProfile(id: number) {
        const profile = await this.getProfileByID(id); // получаем по айди
        await this.profileRepository.remove(profile); // удаляем в начале профайл, потому что он ссылается на
                                                      // юзера => юзера первым удалить не получится
        await this.usersService.deleteProfile(profile.user); // удаляем юзера

        return profile;
    }

    async getProfileByID(id: number) {
        return await this.profileRepository.findOne({ // находим профайл по айди
            where: {id: id},
            relations: ["user", "user.role"] // и возвращаем также его родство с юзером и ролями
        });
    }

}
