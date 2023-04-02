import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ProfilesModule} from "../profiles/profiles.module";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => ProfilesModule),
      UsersModule,
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || "SECRET",
        signOptions: {
          expiresIn: "24h"
        }
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
