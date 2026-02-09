import { Module } from '@nestjs/common';
import { AnimalsService } from './services/animals.service';
import { AnimalsController } from './controllers/animals.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ExcelService } from '../common/excel.service';
import { ExpositoresModule } from '../expositores/expositores.module';

@Module({
    imports: [SupabaseModule, ExpositoresModule],
    controllers: [AnimalsController],
    providers: [AnimalsService, ExcelService],
})
export class AnimalsModule { }
