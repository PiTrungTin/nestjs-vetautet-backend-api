import { Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Query,
  Res
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { storage } from './oss';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  //merge file
  @Get('merge/file')
  mergeFile(@Query("file") fileName: string, @Res() res: Response) {
    //read
    const nameDir = 'uploads/' + fileName;
    const files = fs.readdirSync(nameDir)

    let startPos = 0, count = 0;
    files.map(file => {
      //get Path full
      const filePath = nameDir + '/' + file;
      console.log('filePath |', filePath);

      const streamFile = fs.createReadStream(filePath);
      streamFile.pipe(fs.createWriteStream('uploads/merged/' + fileName, {
          start: startPos
        }).on('finish', () => {
          count++;
          if (files.length === count) {
            fs.rm(nameDir, {
              recursive: true
            }, () => {})
          }
        })
      )

      startPos += fs.statSync(filePath).size;
    })

    return res.json({
      link: `http://localhost:3000/uploads/merged/${fileName}`,
      fileName: fileName
    })
  }


  @Post('upload/large-file')
  @UseInterceptors(FilesInterceptor('files', 20 , { 
    dest: 'uploads',
  }))
  uploadLargeFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: {name: string}) {
    console.log('Uplaod files body', body);
    console.log('upload files', files);

    //1. get file name
    const fileName =  body.name.match(/(.+)-\d+$/)?.[1] ?? body.name;
    const nameDir = 'uploads/chunks-' + fileName;

    //2 mkdir
    if(!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir);
    }

    //3 cp to the folder

    fs.cpSync(files[0].path, nameDir + '/' + body.name);

    //4 remove 
    fs.rmSync(files[0].path);
  }

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
