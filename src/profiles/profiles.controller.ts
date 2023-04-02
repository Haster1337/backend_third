import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ProfilesService} from "./profiles.service";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "../roles/dto/add-role.dto";
import {IsCreatorOrHaveRoleGuard} from "../auth/creator-role.guard";
import {ValidationPipe} from "../pipes/validation.pipe";

@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() profileDto: CreateProfileDto) {
        return this.profilesService.createProfile(profileDto);
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.profilesService.getAllProfiles();
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post("/role")
    addRole(@Body() dto: AddRoleDto) {
        return this.profilesService.addRole(dto);
    }


    @Roles("Admin")
    @UseGuards(IsCreatorOrHaveRoleGuard) // проверка на создателя и админа
    @Put("/:id")
    update(@Param("id") id: number, @Body() dto: CreateProfileDto) {
        return this.profilesService.updateProfile(id, dto);
    }

    @Roles("Admin")
    @UseGuards(IsCreatorOrHaveRoleGuard)
    @Delete("/:id")
    delete(@Param("id") id: number) {
        return this.profilesService.deleteProfile(id);
    }
}
