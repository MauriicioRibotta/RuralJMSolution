export class Animal {
    id: string;
    expositor_id: string; // Foreign Key
    raza_id: number; // Foreign Key
    tipo_inscripcion_id: number; // Foreign Key

    rp: string;
    nombre_animal?: string;
    sexo: string;
    fecha_nacimiento?: Date;

    lote_nro?: number;
    orden_catalogo?: number;
    venta: boolean;
    acepta_terminos: boolean;

    registro_asociacion?: string;
    registro_padre?: string;
    registro_madre?: string;
    fecha_servicio?: Date;

    categoria?: string;
    reemplazante_tipo?: string;

    peso_nacimiento?: number;
    peso_actual?: number;
    circunferencia_escrotal?: number;

    observaciones?: string;

    created_at?: Date;

    // Relations (Joined fields)
    raza?: { nombre: string };
    especie?: { nombre: string }; // Via raza
    tipo_inscripcion?: { nombre: string };
    expositor?: {
        razon_social: string;
        nombre_cabana: string;
    };

    constructor(partial: Partial<Animal>) {
        Object.assign(this, partial);
    }
}
