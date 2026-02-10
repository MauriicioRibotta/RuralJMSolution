import { Expositor } from './expositor.interface';
import { Raza, TipoInscripcion } from './catalogos.interface';

export interface Animal {
    id?: string;
    expositorId: string;
    expositor?: Expositor;
    razaId: number;
    raza?: Raza;
    tipoInscripcionId: number;
    tipoInscripcion?: TipoInscripcion;

    rp: string;
    nombre?: string;
    sexo: 'Macho' | 'Hembra';
    fechaNacimiento?: string;

    loteNro?: number;
    ordenCatalogo?: number;
    venta?: boolean;
    aceptaTerminos?: boolean;

    registroAsociacion?: string;
    registroPadre?: string;
    registroMadre?: string;
    fechaServicio?: string;

    categoria?: string;
    reemplazanteTipo?: string;

    pesoNacimiento?: number;
    pesoActual?: number;
    circunferenciaEscrotal?: number;

    observaciones?: string;
    activo?: boolean;
}
