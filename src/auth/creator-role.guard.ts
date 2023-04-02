import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import {ProfilesService} from "../profiles/profiles.service";

@Injectable()
export class IsCreatorOrHaveRoleGuard implements CanActivate{

    constructor(private jwtService: JwtService,
                private profilesService: ProfilesService,
                private reflector: Reflector) {}

      async canActivate(context: ExecutionContext): Promise<boolean>{
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) // получаем роли, которым доступно взаимодействие

            const req = context.switchToHttp().getRequest(); // достаем реквест
            const authHeader = req.headers.authorization; // хедер авторизации

            // jwt токен
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            // если оба отсутствуют значит пользователь не авторизован, кидаем ошибку
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }

            // из запроса получаем айдишник пользователя
            const params = req.params.id;
            const paramsUser = await this.profilesService.getProfileByID(params); // находим профиль пользователя
            const user = this.jwtService.verify(token); // достаем пользователя из токена

            if(!(user.email === paramsUser.user.email)){ // т.к. мы предполагаем, что емейл уникальный, сравниваем jwt токен и айдишник,
                                                         // если они false, значит айдишник указанный в параметрах и jwt токен логина не одинаковы,
                                                         // значит пользователи разные. Значит есть вероятность, что это админ

                // поэтому проверяем роль пользователя
                return requiredRoles.includes(user.roles.value);
            }

            // если сравнение выше не сработало, значит пользователи одинаковы => даем доступ
            return true;
        } catch (e) {
            throw new HttpException({message: "Нет доступа"}, HttpStatus.FORBIDDEN)
        }
    }
}
