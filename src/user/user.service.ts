import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

  @Inject(DbService)
  dbService!: DbService;


  async login(loginUserDto: LoginUserDto) {
    const users = await this.dbService.read();
    const user = users.find((user: User) => user.accountName === loginUserDto.accountName);
    if (!user) {
      throw new BadRequestException(`Login failed`);
    }
    // check password
    if (user.password !== loginUserDto.password) {
      throw new BadRequestException(`Login failed`);
    }

    return user;
  }

  async register(registerUserDto: RegisterUserDto) {

    const users = await this.dbService.read();

    //check if accountName already exists
    const existingUser = users.find((user: User) => user.accountName === registerUserDto.accountName);
    if (existingUser) {
      throw new BadRequestException(`accountName ${registerUserDto.accountName} already exists`);
    }

    const user =  new User();
    user.accountName = registerUserDto.accountName;
    user.password = registerUserDto.password;

    users.push(user);

    await this.dbService.write(users);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
