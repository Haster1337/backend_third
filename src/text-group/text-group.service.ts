import {Injectable} from '@nestjs/common';
import {CreateTextGroupDto} from "./dto/create-text-group.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {TextGroup} from "./text-group.model";
import {Repository} from "typeorm";
import {FilesService} from "../files/files.service";

@Injectable()
export class TextGroupService {

    // объявляем таблицу/репозиторий для взаимодействия
    constructor(@InjectRepository(TextGroup)
                private textGroupRepository: Repository<TextGroup>,
                private filesService: FilesService
    ) {
    }

    async getAll() {
        const textGroups = await this.textGroupRepository.find();
        return textGroups;
    }

    async create(dto: CreateTextGroupDto, file: string) {
        const textGroup = await this.textGroupRepository.create(dto); // создаем модель текст-групп
        await this.textGroupRepository.save(textGroup); // сохраняем в дб
        if (file) { // проверка был ли файл отправлен, если поля null, либо undefined - ничего не создаем
            await this.filesService.createTextModuleFile(textGroup.id, textGroup.uniqueName, file);
        }
        return textGroup;
    }

    async update(id: number, dto: CreateTextGroupDto, file: string) {
        const textGroup = await this.textGroupRepository.findOneBy({id}); // получаем по айдишнику
        if (file) {
            await this.filesService.updateTextModuleFile(
                {essenceId: id, essenceTable: textGroup.uniqueName},
                {essenceId: id, essenceTable: dto.uniqueName, file: file},
                file
            )
        } else {
            await this.filesService.updateTextModuleRelation(
            {essenceId: textGroup.id, essenceTable: textGroup.uniqueName},
            {essenceId: textGroup.id, essenceTable: dto.uniqueName}
        )
        }
        textGroup.uniqueName = dto.uniqueName; // меняем все поля
        textGroup.name = dto.name;
        textGroup.image = dto.image;
        textGroup.text = dto.text;
        textGroup.group = dto.group;
        await this.textGroupRepository.save(textGroup); // сохраняем изменения


        return textGroup;
    }

    async delete(id) {
        const textGroup = await this.textGroupRepository.findOneBy({id}); // находим по айди
        const file = await this.filesService.removeFile({ // удаляем файл с такими полями связи
            essenceId: textGroup.id,
            essenceTable: textGroup.uniqueName
        })
        await this.textGroupRepository.remove(textGroup); // удаляем

        return textGroup;
    }

    async getAllByGroup(group) {
        const textGroups = await this.textGroupRepository.find({
            where: {
                group // находим все текст-группы, у которых одинаковый group
            }
        })
        return textGroups;
    }
}
