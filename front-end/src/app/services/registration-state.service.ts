import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ExpositorState {
    id: string;
    cuit: string;
    razonSocial: string;
}

@Injectable({
    providedIn: 'root'
})
export class RegistrationStateService {
    private _expositor = new BehaviorSubject<ExpositorState | null>(null);

    constructor() {
        // Try to recover from localStorage on init
        const stored = localStorage.getItem('registration_expositor');
        if (stored) {
            try {
                this._expositor.next(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing stored expositor state', e);
                localStorage.removeItem('registration_expositor');
            }
        }
    }

    get expositor$() {
        return this._expositor.asObservable();
    }

    get currentExpositor() {
        return this._expositor.value;
    }

    setExpositor(expositor: ExpositorState) {
        this._expositor.next(expositor);
        localStorage.setItem('registration_expositor', JSON.stringify(expositor));
    }

    clearState() {
        this._expositor.next(null);
        localStorage.removeItem('registration_expositor');
    }
}
