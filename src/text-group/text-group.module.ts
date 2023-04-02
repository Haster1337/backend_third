import {Module} from '@nestjs/common';
import {TextGroupController} from './text-group.controller';
import {TextGroupService} from './text-group.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TextGroup} from "./text-group.model";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";

@Module({
    controllers: [TextGroupController],
    providers: [TextGroupService],
    imports: [
        TypeOrmModule.forFeature([TextGroup]),
        AuthModule,
        FilesModule
    ],
    exports: [
        TypeOrmModule,
        TextGroupService
    ]
})
export class TextGroupModule {}
