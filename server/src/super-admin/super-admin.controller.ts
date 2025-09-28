import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { SuperadminService } from './super-admin.service';
import { UpdateSuperadminDto, LoginSuperadminDto } from '../dto/super-admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('superAdmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginSuperadminDto, @Res() res: Response) {
    const result = await this.superadminService.login(loginDto);

    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const { token, ...response } = result;
    return res.json(response);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res() res: Response) {
    res.clearCookie('access_token');
    const result = await this.superadminService.signout();
    return res.json(result);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return this.superadminService.getProfile();
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateSuperadminDto: UpdateSuperadminDto) {
    return this.superadminService.updateProfile(updateSuperadminDto);
  }
}