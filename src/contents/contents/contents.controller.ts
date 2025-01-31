import {
  Controller,
  UseGuards,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Header,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetJwtUser } from '../../auths/jwts/decorator/get-jwt-user.decorator';
import { JwtAuthGuard } from '../../auths/jwts/jwt-auth.guard';
import { JwtUser } from '../../auths/jwts/jwt.strategy';

import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('contents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file,
    @Body() createContentDto: CreateContentDto,
    @GetJwtUser() user: JwtUser,
  ) {
    createContentDto.logUserCreate(user.userId, user.userName);
    return this.contentsService.create(createContentDto);
  }

  @Get(':id')
  @Header('Cache-Control', 'no-cache, no-store')
  findOne(@Param('id') id: number) {
    return this.contentsService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateContentDto: UpdateContentDto,
    @GetJwtUser() user: JwtUser,
  ) {
    updateContentDto.logUserUpdate(user.userId, user.userName);
    return this.contentsService.updateOne(id, updateContentDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number, @GetJwtUser() user: JwtUser) {
    return this.contentsService.deleteOne(id, user);
  }
}
