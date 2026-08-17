import { IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({message: "accountName is required"})
    accountName: string;
    @IsNotEmpty({message: "password is required"})
    password: string;
}