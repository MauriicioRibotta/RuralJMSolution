import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateExpositorDto } from './dto/create-expositor.dto';
import { UpdateExpositorDto } from './dto/update-expositor.dto';
import { Expositor } from './entities/expositor.entity';

@Injectable()
export class ExpositoresService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async create(createExpositorDto: CreateExpositorDto): Promise<Expositor> {
        // Map DTO camelCase to DB snake_case
        const dbPayload = {
            cuit: createExpositorDto.cuit,
            razon_social: createExpositorDto.razonSocial,
            nombre_cabana: createExpositorDto.nombreCabana,
            email: createExpositorDto.email,
            telefono: createExpositorDto.telefono,
            provincia: createExpositorDto.provincia,
            localidad: createExpositorDto.localidad,
            departamento: createExpositorDto.departamento,
        };

        const { data, error } = await this.supabase
            .from('expositores')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            // Handle unique constraint violation for CUIT if needed, though frontend should check first or handle 409
            throw new InternalServerErrorException(`Error creating expositor: ${error.message}`);
        }

        return new Expositor(data);
    }

    async findAll(): Promise<Expositor[]> {
        const { data, error } = await this.supabase
            .from('expositores')
            .select('*')
            .order('razon_social', { ascending: true });

        if (error) {
            throw new InternalServerErrorException(`Error fetching expositores: ${error.message}`);
        }

        return data.map((item) => new Expositor(item));
    }

    async findOne(id: string): Promise<Expositor> {
        const { data, error } = await this.supabase
            .from('expositores')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // JSON Not Found in Supabase sometimes returns this
                throw new NotFoundException(`Expositor with ID ${id} not found`);
            }
            throw new InternalServerErrorException(`Error fetching expositor: ${error.message}`);
        }

        return new Expositor(data);
    }

    async findOneByCuit(cuit: string): Promise<Expositor | null> {
        const { data, error } = await this.supabase
            .from('expositores')
            .select('*')
            .eq('cuit', cuit)
            .maybeSingle();

        if (error) {
            throw new InternalServerErrorException(`Error fetching expositor by CUIT: ${error.message}`);
        }

        return data ? new Expositor(data) : null;
    }

    async findOneByEmail(email: string): Promise<Expositor | null> {
        const { data, error } = await this.supabase
            .from('expositores')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            throw new InternalServerErrorException(`Error fetching expositor by Email: ${error.message}`);
        }

        return data ? new Expositor(data) : null;
    }

    async update(id: string, updateExpositorDto: UpdateExpositorDto): Promise<Expositor> {
        const dbPayload: any = {};
        if (updateExpositorDto.razonSocial) dbPayload.razon_social = updateExpositorDto.razonSocial;
        if (updateExpositorDto.nombreCabana) dbPayload.nombre_cabana = updateExpositorDto.nombreCabana;
        if (updateExpositorDto.email !== undefined) dbPayload.email = updateExpositorDto.email;
        if (updateExpositorDto.telefono !== undefined) dbPayload.telefono = updateExpositorDto.telefono;
        if (updateExpositorDto.provincia !== undefined) dbPayload.provincia = updateExpositorDto.provincia;
        if (updateExpositorDto.localidad !== undefined) dbPayload.localidad = updateExpositorDto.localidad;
        if (updateExpositorDto.departamento !== undefined) dbPayload.departamento = updateExpositorDto.departamento;
        dbPayload.updated_at = new Date();


        const { data, error } = await this.supabase
            .from('expositores')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(`Error updating expositor: ${error.message}`);
        }

        return new Expositor(data);
    }
}
