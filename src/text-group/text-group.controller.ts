import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles-auth.decorator";
import {TextGroupService} from "./text-group.service";
import {CreateTextGroupDto} from "./dto/create-text-group.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('text-group')
export class TextGroupController {

    constructor(private textGroupService: TextGroupService) {}

    @Roles("User", "Admin") // могут получать и юзеры, и админы
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.textGroupService.getAll();
    }

    @Roles("User", "Admin")
    @UseGuards(RolesGuard)
    @Get("/:group")
    getBy(@Param("group") group: string) {
        return this.textGroupService.getAllByGroup(group);
    }

    @Roles("Admin") // изменяет только админ
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() dto: CreateTextGroupDto,
           @UploadedFile() file) {
        return this.textGroupService.create(dto, file);
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Put("/:id")
    @UseInterceptors(FileInterceptor("file"))
    update(@Param("id") id: number, @Body() dto: CreateTextGroupDto, @UploadedFile() file) {
        return this.textGroupService.update(id, dto, file);
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Delete("/:id")
    delete(@Param("id") id) {
        return this.textGroupService.delete(id);
    }


}
