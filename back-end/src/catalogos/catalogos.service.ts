import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

@Injectable()
export class CatalogosService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async findAllEspecies() {
        const { data, error } = await this.supabase
            .from('especies')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) {
            throw new InternalServerErrorException(`Error fetching especies: ${error.message}`);
        }
        return data;
    }

    async findAllRazas() {
        const { data, error } = await this.supabase
            .from('razas')
            .select('*, especies(nombre)')
            .order('nombre', { ascending: true });

        if (error) {
            throw new InternalServerErrorException(`Error fetching razas: ${error.message}`);
        }
        return data;
    }

    async findAllTiposInscripcion() {
        const { data, error } = await this.supabase
            .from('tipos_inscripcion')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw new InternalServerErrorException(`Error fetching tipos inscripcion: ${error.message}`);
        }
        return data;
    }
}
