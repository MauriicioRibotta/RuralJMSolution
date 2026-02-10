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

    async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
        // Validate expositor existence if needed, or trust foreign key constraint
        if (!createAnimalDto.expositorId) {
            throw new ConflictException('Expositor ID is required');
        }

        // Map DTO to DB columns
        const dbPayload = this.mapDtoToDb(createAnimalDto);

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

    async findAll(filterCuit?: string): Promise<Animal[]> {
        let query = this.supabase
            .from('animales')
            .select(`
                *,
                raza:razas(nombre, especie:especies(nombre)),
                tipo_inscripcion:tipos_inscripcion(nombre),
                expositor:expositores(razon_social, nombre_cabana)
            `)
            .order('created_at', { ascending: false });

        if (filterCuit) {
            const filterExpositor = await this.expositoresService.findOneByCuit(filterCuit);
            if (filterExpositor) {
                query = query.eq('expositor_id', filterExpositor.id);
            } else {
                // If CUIT provided but not found, return empty
                return [];
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
        const dbPayload = this.mapDtoToDb(updateAnimalDto);

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

    private mapDtoToDb(dto: CreateAnimalDto | UpdateAnimalDto): any {
        const mapping: Record<string, string> = {
            expositorId: 'expositor_id',
            razaId: 'raza_id',
            tipoInscripcionId: 'tipo_inscripcion_id',
            rp: 'rp',
            nombre: 'nombre_animal',
            sexo: 'sexo',
            fechaNacimiento: 'fecha_nacimiento',
            loteNro: 'lote_nro',
            ordenCatalogo: 'orden_catalogo',
            venta: 'venta',
            aceptaTerminos: 'acepta_terminos',
            registroAsociacion: 'registro_asociacion',
            registroPadre: 'registro_padre',
            registroMadre: 'registro_madre',
            fechaServicio: 'fecha_servicio',
            categoria: 'categoria',
            reemplazanteTipo: 'reemplazante_tipo',
            pesoNacimiento: 'peso_nacimiento',
            pesoActual: 'peso_actual',
            circunferenciaEscrotal: 'circunferencia_escrotal',
            observaciones: 'observaciones',
        };

        const dbPayload: any = {};
        for (const [dtoKey, dbKey] of Object.entries(mapping)) {
            if ((dto as any)[dtoKey] !== undefined) {
                dbPayload[dbKey] = (dto as any)[dtoKey];
            }
        }
        return dbPayload;
    }
}
