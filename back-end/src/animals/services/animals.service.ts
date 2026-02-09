import { Injectable, Inject, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAnimalDto } from '../dto/create-animal.dto';
import { UpdateAnimalDto } from '../dto/update-animal.dto';
import { Animal } from '../entities/animal.entity';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { ExpositoresService } from '../../expositores/expositores.service';

@Injectable()
export class AnimalsService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
        private readonly expositoresService: ExpositoresService,
    ) { }

    async create(createAnimalDto: CreateAnimalDto, userEmail?: string): Promise<Animal> {
        if (userEmail) {
            const expositor = await this.expositoresService.findOneByEmail(userEmail);
            if (expositor) {
                // Enforce that the user can only create for themselves
                if (createAnimalDto.expositorId && createAnimalDto.expositorId !== expositor.id) {
                    throw new ConflictException('No tienes permiso para registrar animales de otro expositor.');
                }
                createAnimalDto.expositorId = expositor.id;
            }
        }

        // Map DTO to DB columns
        const dbPayload = {
            expositor_id: createAnimalDto.expositorId,
            raza_id: createAnimalDto.razaId,
            tipo_inscripcion_id: createAnimalDto.tipoInscripcionId,
            rp: createAnimalDto.rp,
            nombre_animal: createAnimalDto.nombre,
            sexo: createAnimalDto.sexo,
            fecha_nacimiento: createAnimalDto.fechaNacimiento,
            lote_nro: createAnimalDto.loteNro,
            orden_catalogo: createAnimalDto.ordenCatalogo,
            venta: createAnimalDto.venta,
            acepta_terminos: createAnimalDto.aceptaTerminos,
            registro_asociacion: createAnimalDto.registroAsociacion,
            registro_padre: createAnimalDto.registroPadre,
            registro_madre: createAnimalDto.registroMadre,
            fecha_servicio: createAnimalDto.fechaServicio,
            categoria: createAnimalDto.categoria,
            reemplazante_tipo: createAnimalDto.reemplazanteTipo,
            peso_nacimiento: createAnimalDto.pesoNacimiento,
            peso_actual: createAnimalDto.pesoActual,
            circunferencia_escrotal: createAnimalDto.circunferenciaEscrotal,
            observaciones: createAnimalDto.observaciones,
        };

        const { data, error } = await this.supabase
            .from('animales')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new ConflictException('Ya existe un animal con ese RP para este expositor y raza.');
            }
            throw new InternalServerErrorException(`Error creating animal: ${error.message}`);
        }

        return new Animal(data);
    }

    async findAll(userEmail?: string, filterCuit?: string): Promise<Animal[]> {
        let query = this.supabase
            .from('animales')
            .select(`
                *,
                raza:razas(nombre, especie:especies(nombre)),
                tipo_inscripcion:tipos_inscripcion(nombre),
                expositor:expositores(razon_social, nombre_cabana)
            `)
            .order('created_at', { ascending: false });

        if (userEmail) {
            const expositor = await this.expositoresService.findOneByEmail(userEmail);
            if (expositor) {
                // If user is an expositor, STRICTLY filter by their ID
                query = query.eq('expositor_id', expositor.id);
            } else if (filterCuit) {
                // If user is Admin (not expositor) and wants to filter by CUIT
                const filterExpositor = await this.expositoresService.findOneByCuit(filterCuit);
                if (filterExpositor) {
                    query = query.eq('expositor_id', filterExpositor.id);
                }
            }
        } else if (filterCuit) {
            // Public/Admin filtering without user context (if allowed)
            const filterExpositor = await this.expositoresService.findOneByCuit(filterCuit);
            if (filterExpositor) {
                query = query.eq('expositor_id', filterExpositor.id);
            }
        }

        const { data, error } = await query;

        if (error) {
            throw new InternalServerErrorException(`Error fetching animals: ${error.message}`);
        }

        return data.map((animal: any) => {
            // Flatten the structure if needed for the entity or frontend, 
            // but keeping it nested is often better for structured data.
            // The Entity constructor handles partial assignment.
            return new Animal(animal);
        });
    }

    async findOne(id: string): Promise<Animal> {
        const { data, error } = await this.supabase
            .from('animales')
            .select(`
                *,
                raza:razas(nombre, especie:especies(nombre)),
                tipo_inscripcion:tipos_inscripcion(nombre),
                expositor:expositores(razon_social, nombre_cabana)
            `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new NotFoundException(`Animal with ID ${id} not found`);
            }
            throw new InternalServerErrorException(`Error fetching animal: ${error.message}`);
        }

        return new Animal(data);
    }

    async update(id: string, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
        const dbPayload: any = {};
        // Map only present fields
        if (updateAnimalDto.expositorId) dbPayload.expositor_id = updateAnimalDto.expositorId;
        if (updateAnimalDto.razaId) dbPayload.raza_id = updateAnimalDto.razaId;
        if (updateAnimalDto.tipoInscripcionId) dbPayload.tipo_inscripcion_id = updateAnimalDto.tipoInscripcionId;
        if (updateAnimalDto.rp) dbPayload.rp = updateAnimalDto.rp;
        if (updateAnimalDto.nombre) dbPayload.nombre_animal = updateAnimalDto.nombre;
        if (updateAnimalDto.sexo) dbPayload.sexo = updateAnimalDto.sexo;
        if (updateAnimalDto.fechaNacimiento) dbPayload.fecha_nacimiento = updateAnimalDto.fechaNacimiento;
        if (updateAnimalDto.loteNro !== undefined) dbPayload.lote_nro = updateAnimalDto.loteNro;
        if (updateAnimalDto.ordenCatalogo !== undefined) dbPayload.orden_catalogo = updateAnimalDto.ordenCatalogo;
        if (updateAnimalDto.venta !== undefined) dbPayload.venta = updateAnimalDto.venta;
        if (updateAnimalDto.aceptaTerminos !== undefined) dbPayload.acepta_terminos = updateAnimalDto.aceptaTerminos;
        if (updateAnimalDto.registroAsociacion !== undefined) dbPayload.registro_asociacion = updateAnimalDto.registroAsociacion;
        if (updateAnimalDto.registroPadre !== undefined) dbPayload.registro_padre = updateAnimalDto.registroPadre;
        if (updateAnimalDto.registroMadre !== undefined) dbPayload.registro_madre = updateAnimalDto.registroMadre;
        if (updateAnimalDto.fechaServicio !== undefined) dbPayload.fecha_servicio = updateAnimalDto.fechaServicio;
        if (updateAnimalDto.categoria !== undefined) dbPayload.categoria = updateAnimalDto.categoria;
        if (updateAnimalDto.reemplazanteTipo !== undefined) dbPayload.reemplazante_tipo = updateAnimalDto.reemplazanteTipo;
        if (updateAnimalDto.pesoNacimiento !== undefined) dbPayload.peso_nacimiento = updateAnimalDto.pesoNacimiento;
        if (updateAnimalDto.pesoActual !== undefined) dbPayload.peso_actual = updateAnimalDto.pesoActual;
        if (updateAnimalDto.circunferenciaEscrotal !== undefined) dbPayload.circunferencia_escrotal = updateAnimalDto.circunferenciaEscrotal;
        if (updateAnimalDto.observaciones !== undefined) dbPayload.observaciones = updateAnimalDto.observaciones;

        if (Object.keys(dbPayload).length === 0) {
            return this.findOne(id);
        }

        const { data, error } = await this.supabase
            .from('animales')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(`Error updating animal: ${error.message}`);
        }

        return new Animal(data);
    }

    async remove(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('animales')
            .delete()
            .eq('id', id);

        if (error) {
            throw new InternalServerErrorException(`Error deleting animal: ${error.message}`);
        }
    }
}
