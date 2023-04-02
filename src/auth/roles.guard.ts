import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try{
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) // массив ролей кому доступно изменение

            if(!requiredRoles){ // если они пусты, то значит любой может взаимодействовать
                return true;
            }

            const req = context.switchToHttp().getRequest() // получаем request
            const authHeader = req.headers.authorization; // смотрим авторизован ли пользователь
            const bearer = authHeader.split(" ")[0];
            const token = authHeader.split(" ")[1];

            if(bearer !== "Bearer" || !token){ // если такого хедера нет, т.е. пользователь не зареган, то выкидываем ошибку
                throw new UnauthorizedException({message: "Пользователь не авторизован"})
            }

            const user = this.jwtService.verify(token); // проверяем токен с самим юзером
            req.user = user;
            return requiredRoles.includes(user.roles.value); // если пользователя есть соответствующая роль,
                                                             // то он получает возможность взаимодействовать
        } catch (e) {
            throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN) // случай, когда у пользователя нет нужной роли
        }
    }


}