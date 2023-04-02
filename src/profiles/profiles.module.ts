import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Profiles} from "./profiles.model";
import {ProfilesController} from "./profiles.controller";
import {ProfilesService} from "./profiles.service";
import {Role} from "../roles/roles.model";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {RolesModule} from "../roles/roles.module";

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        TypeOrmModule.forFeature([Profiles, Role]),
        UsersModule,
        RolesModule,
        forwardRef(() => AuthModule)
    ],
    exports: [
        TypeOrmModule,
        ProfilesService,
    ]
})
export class ProfilesModule {

}
