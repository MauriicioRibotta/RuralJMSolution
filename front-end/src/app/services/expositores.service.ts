import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Expositor } from '../interfaces/expositor.interface';

@Injectable({
    providedIn: 'root'
})
export class ExpositoresService {
    private apiUrl = `${environment.apiUrl}/expositores`;

    constructor(private http: HttpClient) { }

    getByCuit(cuit: string): Observable<Expositor> {
        return this.http.get<Expositor>(`${this.apiUrl}/cuit/${cuit}`);
    }

    getById(id: string): Observable<Expositor> {
        return this.http.get<Expositor>(`${this.apiUrl}/${id}`);
    }

    getProfile(): Observable<Expositor> {
        return this.http.get<Expositor>(`${this.apiUrl}/profile`);
    }

    create(expositor: Expositor): Observable<Expositor> {
        return this.http.post<Expositor>(this.apiUrl, expositor);
    }

    findAll(): Observable<Expositor[]> {
        return this.http.get<Expositor[]>(this.apiUrl);
    }

    update(id: string, expositor: Expositor): Observable<Expositor> {
        return this.http.patch<Expositor>(`${this.apiUrl}/${id}`, expositor);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
