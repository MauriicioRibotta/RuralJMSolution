export interface Especie {
    id: number;
    nombre: string;
}

export interface Raza {
    id: number;
    nombre: string;
    especie_id: number;
    especie?: Especie;
}

export interface TipoInscripcion {
    id: number;
    nombre: string;
}
