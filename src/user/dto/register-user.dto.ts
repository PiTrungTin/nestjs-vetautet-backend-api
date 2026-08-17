import { IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({message: "accountName is required"})
    accountName: string;
    @IsNotEmpty({message: "password is required"})
    @MinLength(8, {message: "password must be at least 8 characters long"})
    password: string;
}