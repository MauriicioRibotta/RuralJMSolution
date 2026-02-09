import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AnimalsService, Animal } from '../../services/animals.service';
import { RegistrationStateService, ExpositorState } from '../../services/registration-state.service';

@Component({
    selector: 'app-registration-summary',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900">Resumen de Inscripción</h2>
          <p class="mt-2 text-gray-600" *ngIf="currentExpositor">
            Expositor: <strong>{{ currentExpositor.razonSocial }}</strong> (CUIT: {{ currentExpositor.cuit }})
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mb-6">
            <button routerLink="/animals/new" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
                + Agregar Otro Animal
            </button>
            <button (click)="finalizar()" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow">
                Finalizar Inscripción
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div *ngIf="loading" class="p-6 text-center text-gray-500">Cargando animales...</div>
            
            <div *ngIf="!loading && animals.length === 0" class="p-6 text-center text-gray-500">
                No hay animales registrados en esta sesión.
            </div>

            <table *ngIf="!loading && animals.length > 0" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RP</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let animal of animals">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ animal.rp }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ animal.nombre || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ animal.raza?.nombre || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ animal.sexo }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ animal.categoria || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

      </div>
    </div>
  `
})
export class RegistrationSummaryComponent implements OnInit {
    currentExpositor: ExpositorState | null = null;
    animals: Animal[] = [];
    loading = true;

    constructor(
        private stateService: RegistrationStateService,
        private animalsService: AnimalsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.currentExpositor = this.stateService.currentExpositor;
        if (!this.currentExpositor) {
            this.router.navigate(['/inscripcion/expositor']);
            return;
        }

        this.loadAnimals();
    }

    loadAnimals() {
        this.loading = true;
        // Use the CUIT from state to filter animals
        this.animalsService.findAll(this.currentExpositor!.cuit).subscribe({
            next: (animals) => {
                this.animals = animals;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    finalizar() {
        // Clear state/Session if needed? Or just go to Home?
        // User might want to verify later...
        if (confirm('¿Está seguro que desea finalizar? Se cerrará la sesión de inscripción.')) {
            this.stateService.clearState();
            this.router.navigate(['/']);
        }
    }
}
