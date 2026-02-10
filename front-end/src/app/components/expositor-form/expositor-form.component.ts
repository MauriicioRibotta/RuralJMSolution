import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpositoresService } from '../../services/expositores.service';
import { RegistrationStateService } from '../../services/registration-state.service';
import { Expositor } from '../../interfaces/expositor.interface';

@Component({
    selector: 'app-expositor-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Datos del Expositor
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingrese su CUIT para comenzar la inscripción.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <!-- Loading State -->
          <div *ngIf="loading" class="flex justify-center mb-4">
             <span class="text-blue-600 font-semibold">Procesando...</span>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- CUIT Field -->
            <div>
              <label for="cuit" class="block text-sm font-medium text-gray-700">CUIT (sin guiones)</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input type="text" formControlName="cuit" id="cuit" 
                    [class.border-red-500]="getError('cuit')"
                    class="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2 border" 
                    placeholder="20123456789">
                <button type="button" (click)="checkCuit()" 
                    [disabled]="form.get('cuit')?.invalid || loading"
                    class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                    Verificar
                </button>
              </div>
               <p *ngIf="getError('cuit')" class="mt-2 text-sm text-red-600">CUIT inválido (11 números requeridos).</p>
               <p *ngIf="cuitFound" class="mt-2 text-sm text-green-600 font-bold">¡Expositor encontrado!</p>
            </div>

            <!-- Other Fields (Only show if verified or new) -->
            <div *ngIf="showFullForm" class="space-y-6">
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Razón Social</label>
                  <input type="text" formControlName="razonSocial" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre Cabaña</label>
                  <input type="text" formControlName="nombreCabana" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email (Contacto)</label>
                  <input type="email" formControlName="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input type="text" formControlName="telefono" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Provincia</label>
                        <input type="text" formControlName="provincia" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                </div>

                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Localidad</label>
                        <input type="text" formControlName="localidad" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Departamento</label>
                        <input type="text" formControlName="departamento" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4">
                    <button type="submit" 
                        [disabled]="form.invalid || loading"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                        {{ isModeEdit ? 'Confirmar y Continuar' : 'Registrar y Continuar' }}
                    </button>
                </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class ExpositorFormComponent {
    form: FormGroup;
    loading = false;
    showFullForm = false;
    cuitFound = false;
    isModeEdit = false; // True if found existing, False if creating new

    constructor(
        private fb: FormBuilder,
        private expositoresService: ExpositoresService,
        private stateService: RegistrationStateService,
        private router: Router
    ) {
        this.form = this.fb.group({
            cuit: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            razonSocial: ['', Validators.required],
            nombreCabana: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telefono: [''],
            provincia: [''],
            localidad: [''],
            departamento: ['']
        });
    }

    getError(controlName: string) {
        const control = this.form.get(controlName);
        return control?.invalid && (control?.dirty || control?.touched);
    }

    checkCuit() {
        const cuit = this.form.get('cuit')?.value;
        if (!cuit || this.form.get('cuit')?.invalid) return;

        this.loading = true;
        this.expositoresService.getByCuit(cuit).subscribe({ // Assuming service has this method
            next: (expositor) => {
                this.loading = false;
                if (expositor) {
                    this.proceed(expositor);
                } else {
                    this.cuitFound = false;
                    this.showFullForm = true;
                    this.isModeEdit = false;
                    // Clear other fields
                    this.form.reset({ cuit: cuit });
                }
            },
            error: (err) => {
                this.loading = false;
                console.error(err);
                // Fallback: Assume not found if specific error, or general error
                this.cuitFound = false;
                this.showFullForm = true;
                this.isModeEdit = false;
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        const data = this.form.value;

        if (this.isModeEdit) {
            // Find existing again to get ID (or we could have stored it)
            // Ideally getByCuit returns ID
            this.expositoresService.getByCuit(data.cuit).subscribe({
                next: (expositor) => {
                    if (expositor) {
                        this.proceed(expositor);
                    }
                }
            });
        } else {
            // Create new
            this.expositoresService.create(data).subscribe({
                next: (newExpositor) => {
                    this.proceed(newExpositor);
                },
                error: (err) => {
                    this.loading = false;
                    alert('Error al crear expositor: ' + err.message);
                }
            });
        }
    }

    private proceed(expositor: any) {
        this.stateService.setExpositor({
            id: expositor.id,
            cuit: expositor.cuit,
            razonSocial: expositor.razon_social || expositor.razonSocial // Handle both cases maybe
        });
        this.loading = false;
        this.router.navigate(['/inscripcion/resumen']); // Validate flow preference
    }
}
