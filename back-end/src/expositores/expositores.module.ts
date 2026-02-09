import { Module } from '@nestjs/common';
import { ExpositoresService } from './expositores.service';
import { ExpositoresController } from './expositores.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [SupabaseModule],
    controllers: [ExpositoresController],
    providers: [ExpositoresService],
    exports: [ExpositoresService], // Export service to be used in AnimalsModule
})
export class ExpositoresModule { }
