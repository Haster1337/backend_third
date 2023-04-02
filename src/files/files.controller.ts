import {Body, Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";
import {CreateFileDto} from "./dto/create-file.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";

@Controller('files')
export class FilesController {

    constructor(private filesService: FilesService) {}

    @Get()
    async getAll(){
        return await this.filesService.getAll()
    }

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    async create(@Body() dto: CreateFileDto,
                 @UploadedFile() file){
        return await this.filesService.createAndSaveFile(dto, file);
    }

    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Delete()
    async delete(){
        return await this.filesService.deleteTempFiles();
    }
}
