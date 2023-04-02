import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {CreateProfileDto} from "../profiles/dto/create-profile.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("/login")
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto);
    }

    @Post("/registration")
    registration(@Body() profileDto: CreateProfileDto){

        return this.authService.registration(profileDto);
    }

}
