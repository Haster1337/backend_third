import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./roles.model";
import {Profiles} from "../profiles/profiles.model";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role, Profiles])],
  exports: [TypeOrmModule, RolesService]
})
export class RolesModule {}
