import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expositor } from '../interfaces/expositor.interface';
import { Raza, TipoInscripcion } from '../interfaces/catalogos.interface';

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
    activo?: boolean; // Keep for compatibility if needed, though not in new DB schema as a column, maybe calculated
}

@Injectable({
    providedIn: 'root'
})
export class AnimalsService {
    private apiUrl = `${environment.apiUrl}/animals`;

    constructor(private http: HttpClient) { }

    create(animal: Animal): Observable<Animal> {
        return this.http.post<Animal>(this.apiUrl, animal);
    }

    findAll(cuit?: string): Observable<Animal[]> {
        const params: any = {};
        if (cuit) {
            params.cuit = cuit;
        }
        return this.http.get<Animal[]>(this.apiUrl, { params });
    }

    exportExcel(): void {
        window.open(`${this.apiUrl}/export`, '_blank');
    }

    getById(id: string): Observable<Animal> {
        return this.http.get<Animal>(`${this.apiUrl}/${id}`);
    }

    update(id: string, animal: Animal): Observable<Animal> {
        return this.http.patch<Animal>(`${this.apiUrl}/${id}`, animal);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
