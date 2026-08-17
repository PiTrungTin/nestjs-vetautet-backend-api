import { Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { storage } from './oss';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  register(@Body() registerUserDto: RegisterUserDto) {
    console.log('register user: ', registerUserDto);
    return this.userService.register(registerUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    console.log('login user: ', loginUserDto);
    return this.userService.login(loginUserDto);
  }

  @Post('upload/avt')
  @UseInterceptors(FileInterceptor('file', { 
    dest: 'uploads',
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 3, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only JPEG and PNG files are allowed!'), false);
      }
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file: ', file.path);
    return file.path;
  }
} 
