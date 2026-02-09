import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogosService } from '../../services/catalogos.service';
import { Especie, Raza, TipoInscripcion } from '../../interfaces/catalogos.interface';
import { Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-catalogos-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './catalogos-manager.component.html'
})
export class CatalogosManagerComponent implements OnInit {
    especies: Especie[] = [];
    razas: Raza[] = [];
    tiposInscripcion: TipoInscripcion[] = [];

    activeTab: 'especies' | 'razas' | 'tipos' = 'especies';

    newEspecie: string = '';
    newTipoInscripcion: string = '';
    newRazaName: string = '';
    newRazaEspecieId: number | null = null;

    constructor(private catalogosService: CatalogosService) { }

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        forkJoin({
            especies: this.catalogosService.getEspecies(),
            razas: this.catalogosService.getRazas(),
            tipos: this.catalogosService.getTiposInscripcion()
        }).subscribe(data => {
            this.especies = data.especies;
            this.razas = data.razas;
            this.tiposInscripcion = data.tipos;
        });
    }

    // Especie Actions
    addEspecie() {
        if (!this.newEspecie.trim()) return;
        // Note: ID is 0 or ignored by backend for creation usually
        const especie: Especie = { id: 0, nombre: this.newEspecie };
        this.catalogosService.createEspecie(especie).subscribe(() => {
            this.newEspecie = '';
            this.loadAll(); // Reload or push to local array
        });
    }
    deleteEspecie(id: number) {
        if (confirm('¿Eliminar especie?')) {
            this.catalogosService.deleteEspecie(id).subscribe(() => this.loadAll());
        }
    }

    // Raza Actions
    addRaza() {
        if (!this.newRazaName.trim() || !this.newRazaEspecieId) return;
        const raza: Raza = {
            id: 0,
            nombre: this.newRazaName,
            especie_id: this.newRazaEspecieId
        };
        this.catalogosService.createRaza(raza).subscribe(() => {
            this.newRazaName = '';
            this.newRazaEspecieId = null;
            this.loadAll();
        });
    }
    deleteRaza(id: number) {
        if (confirm('¿Eliminar raza?')) {
            this.catalogosService.deleteRaza(id).subscribe(() => this.loadAll());
        }
    }

    // Tipo Inscripcion Actions
    addTipo() {
        if (!this.newTipoInscripcion.trim()) return;
        const tipo: TipoInscripcion = { id: 0, nombre: this.newTipoInscripcion };
        this.catalogosService.createTipoInscripcion(tipo).subscribe(() => {
            this.newTipoInscripcion = '';
            this.loadAll();
        });
    }
    deleteTipo(id: number) {
        if (confirm('¿Eliminar tipo de inscripción?')) {
            this.catalogosService.deleteTipoInscripcion(id).subscribe(() => this.loadAll());
        }
    }
}
