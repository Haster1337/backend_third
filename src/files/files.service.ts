import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Files} from "./files.model";
import {CreateFileDto} from "./dto/create-file.dto";
import {FileRelationDto} from "./dto/file-relation.dto";


@Injectable()
export class FilesService {

    constructor(@InjectRepository(Files)
                private filesRepository: Repository<Files>) {
    }

    async createTextModuleFile(id, name, file): Promise<Files[]> {
        const dto: CreateFileDto = {file: file, essenceId: id, essenceTable: name}; // для удобства записываем это в переменную
        const fileTable = await this.createAndSaveFile(dto, file);
        return fileTable;
    }

    async deleteTempFiles() {
        const files = await this.filesRepository.find(); // находим все файлы
        const date = new Date();
        files.map(async file => {
            // по-хорошему, нужно смотреть вначале использования файла, если эти поля пусты, то только в том случае
            // проверяем сколько времени прошло и при положительном исходе удаляем
            // Но в качестве тестового варианта делаем такое сравнение
            if (date.getTime() - file.created_at.getTime() >= 1000 * 60 * 60) { // если прошло больше часа с момента создания
                await this.filesRepository.remove(file); // удаляем
                return;
            }
            if (!file.essenceTable && !file.essenceId) { // смотрим на использования, если они пусты тоже удаляем
                await this.filesRepository.remove(file);
                return;
            }
        })
    }

    async createAndSaveFile(dto, file) {
        if (dto.essenceTable && dto.essenceId) {
            const includes = await this.checkUnique({ // проверяем уникальность полей отношений
                essenceId: dto.essenceId,
                essenceTable: dto.essenceTable
            });
            if (!includes) { // если вернулся false, т.е. не уникально, тогда кидаем ошибку
                throw new HttpException("Файл с значениями essenceId и essenceTable уже существуют", HttpStatus.BAD_REQUEST)
            }
        }
        const fileName = await this.createFile(file);
        const fileTable = await this.filesRepository.create({...dto, file: fileName}); // создаем таблицу, но перезаписываем имя файла
        await this.filesRepository.save(fileTable); // сохраняем
        return fileTable;
    }

    async createFile(file) {
        try {
            const fileExtension = file.originalname.split(".").pop(); // достаем расширение файла(.jpg, .png и т.д.)
            const fileName = uuid.v4() + "." + fileExtension; // создаем уникальное название и добавляем расширение
            const filePath = path.resolve(__dirname, "..", "static"); // находим путь до папки статик
            if (!fs.existsSync(filePath)) { // если путь не нашелся, т.е. такой папки нет
                fs.mkdirSync(filePath, {recursive: true});  // создаем ее и в том числе и рекурсивно
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer); // записываем содержимое файла

            return fileName;
        } catch (e) {
            throw new HttpException("Произошла ошибка при записи файла", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async checkUnique(dto: FileRelationDto) {
        const filesIncludes = await this.findAllBy({
            essenceId: dto.essenceId,
            essenceTable: dto.essenceTable
        });
        return filesIncludes.length === 0; // проверяем длину массива, если длина больше 0, значит такие поля используются и возвращаем false
    }

    async findAllBy(dto: FileRelationDto) {
        const files = await this.filesRepository.find({
            where: {
                essenceId: dto.essenceId,
                essenceTable: dto.essenceTable
            }
        })
        return files
    }

    async removeFile(dto: FileRelationDto) {
        const file = await this.findOneByRelation(dto); // ищем такой файл, если такой есть
        await this.filesRepository.remove(file); // и удаляем
        return file;
        // если file = [], то есть ничего не нашло, из файл-репозитория ничего не будет удалено
    }

    async findOneByRelation(dto: FileRelationDto) {
        const file = await this.filesRepository.findOne({
            where: {
                essenceId: dto.essenceId,
                essenceTable: dto.essenceTable
            }
        })
        return file;
    }

    async getAll() {
        return await this.filesRepository.find()
    }

    async updateTextModuleFile(initialDto: FileRelationDto, updatingDto: CreateFileDto, file) {
        const fileName = await this.createFile(file); // создаем файл
        let fileTable = await this.findOneByRelation(initialDto); // ищем этот файл в репозитории
        if (fileTable) {
            fileTable.essenceId = updatingDto.essenceId;
            fileTable.essenceTable = updatingDto.essenceTable;
            fileTable.file = fileName;
        } else {
            fileTable = await this.filesRepository.create({...updatingDto, file: fileName})
        }
        // меняем поля


        await this.filesRepository.save(fileTable); // сохраняем изменения

        return fileTable;
    }

    async updateTextModuleRelation(initialDto: FileRelationDto, updatingDto: FileRelationDto) {
        const file = await this.findOneByRelation(initialDto); // получаем файл
        file.essenceId = updatingDto.essenceId; // обновляем поля отношений
        file.essenceTable = updatingDto.essenceTable;
        await this.filesRepository.save(file); // сохраняем изменения

        return file;
    }
}




