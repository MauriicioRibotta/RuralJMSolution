import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Especie, Raza, TipoInscripcion } from '../interfaces/catalogos.interface';

@Injectable({
    providedIn: 'root'
})
export class CatalogosService {
    private apiUrl = `${environment.apiUrl}/catalogos`;

    constructor(private http: HttpClient) { }

    getEspecies(): Observable<Especie[]> {
        return this.http.get<Especie[]>(`${this.apiUrl}/especies`);
    }

    getRazas(): Observable<Raza[]> {
        return this.http.get<Raza[]>(`${this.apiUrl}/razas`);
    }

    getTiposInscripcion(): Observable<TipoInscripcion[]> {
        return this.http.get<TipoInscripcion[]>(`${this.apiUrl}/tipos-inscripcion`);
    }

    // Especies CRUD
    createEspecie(especie: Especie): Observable<Especie> {
        return this.http.post<Especie>(`${this.apiUrl}/especies`, especie);
    }
    updateEspecie(id: number, especie: Especie): Observable<Especie> {
        return this.http.patch<Especie>(`${this.apiUrl}/especies/${id}`, especie);
    }
    deleteEspecie(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/especies/${id}`);
    }

    // Razas CRUD
    createRaza(raza: Raza): Observable<Raza> {
        return this.http.post<Raza>(`${this.apiUrl}/razas`, raza);
    }
    updateRaza(id: number, raza: Raza): Observable<Raza> {
        return this.http.patch<Raza>(`${this.apiUrl}/razas/${id}`, raza);
    }
    deleteRaza(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/razas/${id}`);
    }

    // Tipos Inscripcion CRUD
    createTipoInscripcion(tipo: TipoInscripcion): Observable<TipoInscripcion> {
        return this.http.post<TipoInscripcion>(`${this.apiUrl}/tipos-inscripcion`, tipo);
    }
    updateTipoInscripcion(id: number, tipo: TipoInscripcion): Observable<TipoInscripcion> {
        return this.http.patch<TipoInscripcion>(`${this.apiUrl}/tipos-inscripcion/${id}`, tipo);
    }
    deleteTipoInscripcion(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tipos-inscripcion/${id}`);
    }
}
