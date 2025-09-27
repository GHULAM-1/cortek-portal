import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { createSupabaseClient, createSupabaseServiceClient } from '../config/supabase.config';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => createSupabaseClient(),
    },
    {
      provide: 'SUPABASE_SERVICE_CLIENT',
      useFactory: () => createSupabaseServiceClient(),
    },
    SupabaseService,
  ],
  exports: [SupabaseService, 'SUPABASE_CLIENT', 'SUPABASE_SERVICE_CLIENT'],
})
export class SupabaseModule {}