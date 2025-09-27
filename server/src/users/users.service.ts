import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtAuthService } from '../auth/jwt.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/users.dto';
import { User, LoginResponse, CreateUserResponse } from '../types/users-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  private getTableNameByRole(role: string): string {
    const tableMap = {
      'superadmin': 'super-admin',
      'admin': 'admin',
      'team': 'team',
      'client': 'client'
    };
    return tableMap[role] || null;
  }

  private async syncToRoleTable(user: any, operation: 'create' | 'update'): Promise<void> {
    const tableName = this.getTableNameByRole(user.role);
    if (!tableName) return;

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      is_deleted: user.is_deleted || false,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    if (operation === 'create') {
      const { error } = await this.supabaseService
        .getServiceClient()
        .from(tableName)
        .insert(userData);

      if (error) {
        console.error(`Failed to sync user to ${tableName} table:`, error.message);
      }
    } else if (operation === 'update') {
      const { error } = await this.supabaseService
        .getServiceClient()
        .from(tableName)
        .upsert(userData);

      if (error) {
        console.error(`Failed to sync user update to ${tableName} table:`, error.message);
      }
    }
  }

  async login(loginDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const { data: user, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const { access_token } = await this.jwtAuthService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      access_token,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const { email, password, name, role } = createUserDto;

    // Check if user already exists
    const { data: existingUser } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in main users table
    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .insert({
        email,
        name,
        role,
        password: hashedPassword,
      })
      .select('id, email, name, role, password, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Send welcome email BEFORE syncing to role table (fail fast if email fails)
    try {
      const loginUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';
      await this.emailService.sendWelcomeEmail({
        name: data.name,
        email: data.email,
        password: password, // Send original password before hashing
        role: data.role,
        loginUrl: `${loginUrl}/login`,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);

      // Delete the user that was just created since email failed
      await this.supabaseService
        .getServiceClient()
        .from('users')
        .delete()
        .eq('id', data.id);

      throw new Error('Failed to send welcome email. User creation cancelled.');
    }

    // Only sync to role-specific table if email was sent successfully
    await this.syncToRoleTable(data, 'create');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = data;

    return {
      message: 'User created successfully and welcome email sent',
      user: userWithoutPassword,
    };
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('is_deleted', false);

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: string): Promise<User> {
    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<{ message: string; user: User }> {
    const updateData: any = {};

    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      // Check if email is already taken by another user
      const { data: existingUser } = await this.supabaseService
        .getServiceClient()
        .from('users')
        .select('id, email')
        .eq('email', updateUserDto.email)
        .neq('id', id) // Exclude current user
        .single();

      if (existingUser) {
        throw new ConflictException('Email is already taken by another user');
      }

      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.role) {
      updateData.role = updateUserDto.role;
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, password, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('User not found');
    }

    // Sync to role-specific table
    await this.syncToRoleTable(data, 'update');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = data;

    return {
      message: 'User updated successfully',
      user: userWithoutPassword,
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    // Soft delete - set is_deleted to true instead of actual deletion
    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, email, name, role, password, is_deleted, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('User not found');
    }

    // Sync soft delete to role-specific table
    await this.syncToRoleTable(data, 'update');

    return {
      message: 'User deleted successfully',
    };
  }

  async getMe(email: string): Promise<User> {
    const { data, error } = await this.supabaseService
      .getServiceClient()
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('email', email)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }
}