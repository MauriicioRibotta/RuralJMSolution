export class Expositor {
    id: string;
    cuit: string;
    razon_social: string; // Mapped from DB column
    nombre_cabana: string; // Mapped from DB column
    email?: string;
    telefono?: string;
    provincia?: string;
    localidad?: string;
    departamento?: string;
    created_at?: Date;
    updated_at?: Date;

    constructor(partial: Partial<Expositor>) {
        Object.assign(this, partial);
    }
}
