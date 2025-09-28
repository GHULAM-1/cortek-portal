import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtAuthService } from '../auth/jwt.service';
import { UpdateSuperadminDto, LoginSuperadminDto } from '../dto/super-admin.dto';
import { SuperAdmin } from '../types/super-admin-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async login(loginDto: LoginSuperadminDto) {
    const { email, password } = loginDto;

    const { data: superAdmin, error } = await this.supabaseService
      .getServiceClient()
      .from('"superAdmin"')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !superAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password_hash, ...result } = superAdmin;
    const token = await this.jwtAuthService.generateToken({
      id: result.id,
      email: result.email,
      role: 'superAdmin'
    });

    return {
      message: 'Login successful',
      superAdmin: result,
      token: token.access_token,
    };
  }

  async signout() {
    return {
      message: 'Signout successful',
    };
  }

  async getProfile(): Promise<SuperAdmin> {
    const { data: superAdmin, error } = await this.supabaseService
      .getServiceClient()
      .from('"superAdmin"')
      .select('id, email, name, created_at, updated_at')
      .single();

    if (error || !superAdmin) {
      throw new NotFoundException('SuperAdmin not found');
    }

    return superAdmin;
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
      .from('"superAdmin"')
      .update(updateData)
      .select('id, email, name, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return {
      message: 'Profile updated successfully',
      superAdmin: data,
    };
  }
}