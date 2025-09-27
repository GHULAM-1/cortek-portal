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

}