import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
    @Inject('SUPABASE_SERVICE_CLIENT') private supabaseService: SupabaseClient,
  ) {}

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getServiceClient(): SupabaseClient {
    return this.supabaseService;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.supabase.auth.getUser(accessToken);
    return { data, error };
  }
}