import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { User, UserProperties } from "../entities/user.entity";
import { NotExists } from "src/inc/validators/not-exists.validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(UserProperties.MAX_EMAIL_LENGTH)
    @NotExists(User, 'email', undefined, { message: 'Email already in use' })
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(UserProperties.PASSWORD_MIN_LENGTH)
    @MaxLength(UserProperties.PASSWORD_MAX_LENGTH)
    password: string;

}