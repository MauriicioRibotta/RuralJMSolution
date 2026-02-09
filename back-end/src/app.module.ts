import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AnimalsModule } from './animals/animals.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { ExpositoresModule } from './expositores/expositores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    SupabaseModule,
    AnimalsModule,
    CatalogosModule,
    ExpositoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
