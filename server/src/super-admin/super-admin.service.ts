import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtAuthService } from '../auth/jwt.service';
import { UpdateSuperadminDto, LoginSuperadminDto } from '../dto/super-admin.dto';
import { Superadmin } from '../types/super-admin-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async login(loginDto: LoginSuperadminDto) {
    const { email, password } = loginDto;

    const { data: superadmin, error } = await this.supabaseService
      .getServiceClient()
      .from('"super-admin"')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !superadmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, superadmin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password_hash, ...result } = superadmin;
    const token = await this.jwtAuthService.generateToken({
      id: result.id,
      email: result.email,
      role: 'superadmin'
    });

    return {
      message: 'Login successful',
      superadmin: result,
      token: token.access_token,
    };
  }

  async signout() {
    return {
      message: 'Signout successful',
    };
  }

  async getProfile(): Promise<Superadmin> {
    const { data: superadmin, error } = await this.supabaseService
      .getServiceClient()
      .from('"super-admin"')
      .select('id, email, name, created_at, updated_at')
      .single();

    if (error || !superadmin) {
      throw new NotFoundException('Superadmin not found');
    }

    return superadmin;
  }

  async updateProfile(updateDto: UpdateSuperadminDto) {
    const updateData: any = {};

    if (updateDto.name) {
      updateData.name = updateDto.name;
    }

    if (updateDto.email) {
      updateData.email = updateDto.email;
    }

    if (updateDto.password) {
      updateData.password_hash = await bcrypt.hash(updateDto.password, 10);
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('"super-admin"')
      .update(updateData)
      .select('id, email, name, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return {
      message: 'Profile updated successfully',
      superadmin: data,
    };
  }
}