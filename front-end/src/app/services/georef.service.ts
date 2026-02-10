import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface GeoResponse<T> {
    cantidad: number;
    inicio: number;
    total: number;
    [key: string]: any;
}

export interface Provincia {
    id: string;
    nombre: string;
}

export interface Departamento {
    id: string;
    nombre: string;
    provincia?: Provincia;
}

export interface Localidad {
    id: string;
    nombre: string;
    unicipio?: { nombre: string; id: string };
    departamento?: Departamento;
    provincia?: Provincia;
}

@Injectable({
    providedIn: 'root'
})
export class GeoRefService {
    private apiUrl = 'https://apis.datos.gob.ar/georef/api';

    constructor(private http: HttpClient) { }

    getProvincias(): Observable<Provincia[]> {
        return this.http.get<any>(`${this.apiUrl}/provincias?orden=nombre&aplanar=true&campos=basico&max=100`).pipe(
            map(res => res.provincias)
        );
    }

    getDepartamentos(provinciaNombre: string): Observable<Departamento[]> {
        // GeoRef allows filtering by 'provincia' name directly
        return this.http.get<any>(`${this.apiUrl}/departamentos?provincia=${encodeURIComponent(provinciaNombre)}&orden=nombre&aplanar=true&campos=basico&max=200`).pipe(
            map(res => res.departamentos)
        );
    }

    getLocalidades(departamentoNombre: string, provinciaNombre: string): Observable<Localidad[]> {
        // We filter by both roughly to ensure uniqueness if needed, but dept name should be enough within a province context
        // Actually standard usage is filtering by department and province to be safe
        return this.http.get<any>(`${this.apiUrl}/localidades?provincia=${encodeURIComponent(provinciaNombre)}&departamento=${encodeURIComponent(departamentoNombre)}&orden=nombre&aplanar=true&campos=basico&max=200`).pipe(
            map(res => res.localidades)
        );
    }
}
