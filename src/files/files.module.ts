import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Files} from "./files.model";
import { FilesController } from './files.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
    providers: [FilesService],
    imports: [
        TypeOrmModule.forFeature([Files]),
        AuthModule
    ],
    exports: [TypeOrmModule, FilesService],
    controllers: [FilesController]
})
export class FilesModule {
}
