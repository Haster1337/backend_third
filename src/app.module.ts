import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm"
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import { ProfilesService } from './profiles/profiles.service';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesModule } from './profiles/profiles.module';
import {Profiles} from "./profiles/profiles.model";
import {Users} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { TextGroupModule } from './text-group/text-group.module';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "path";

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        ConfigModule.forRoot( {
            envFilePath: ".env"
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, "static")
        }),
        // подключаем typeOrm для работы с postgres
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [Profiles, Users, Role],
            synchronize: true,
            autoLoadEntities: true,
        }),
        UsersModule,
        ProfilesModule,
        RolesModule,
        AuthModule,
        TextGroupModule,
        FilesModule,
    ]
})
export class AppModule {

}

