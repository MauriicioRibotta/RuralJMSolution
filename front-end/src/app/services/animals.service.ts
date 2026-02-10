import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Animal } from '../interfaces/animal.interface';

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
        let params = new HttpParams();
        if (cuit) {
            params = params.set('cuit', cuit);
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
