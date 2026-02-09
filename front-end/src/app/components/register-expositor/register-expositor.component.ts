import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpositoresService } from '../../services/expositores.service';
import { AuthService } from '../../services/auth.service';
import { Expositor } from '../../interfaces/expositor.interface';

@Component({
  selector: 'app-register-expositor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        
        <!-- HEADER -->
        <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {{ isLoggedIn ? 'Registro de Expositor' : 'Ingresar para Inscribir' }}
        </h2>
        
        <!-- STEP 1: LOGIN (Magic Link) -->
        <div *ngIf="!isLoggedIn && !magicLinkSent" class="space-y-6">
            <p class="text-center text-gray-600 mb-6">
                Ingrese su email para recibir un enlace de acceso seguro.
            </p>
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" formControlName="email" class="input-field" placeholder="su-email@ejemplo.com">
                    <p *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="text-red-500 text-xs italic">
                        Email válido es requerido.
                    </p>
                </div>
                <button type="submit" 
                    [disabled]="loginForm.invalid || loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50">
                    {{ loading ? 'Enviando enlace...' : 'Enviar Enlace de Acceso' }}
                </button>
            </form>
        </div>

        <!-- STEP 1.5: MAGIC LINK SENT -->
        <div *ngIf="!isLoggedIn && magicLinkSent" class="text-center space-y-6">
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">¡Enlace enviado!</strong>
                <span class="block sm:inline"> Revise su correo electrónico {{ loginForm.get('email')?.value }} y haga clic en el enlace para continuar.</span>
            </div>
            <p class="text-gray-600 text-sm">
                Puede cerrar esta pestaña una vez que haya ingresado desde su correo.
            </p>
        </div>

        <!-- STEP 2: REGISTRATION FORM (Only if logged in) -->
        <div *ngIf="isLoggedIn">
            <p class="text-center text-gray-600 mb-6">
            Complete sus datos para poder registrar animales.
            </p>

            <form [formGroup]="expositorForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">CUIT</label>
                <input type="text" formControlName="cuit" class="input-field" placeholder="11 dígitos sin guiones">
                <p *ngIf="getError('cuit')" class="text-red-500 text-xs italic">
                    CUIT válido es requerido (11 números).
                </p>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Razón Social</label>
                <input type="text" formControlName="razonSocial" class="input-field">
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Nombre Cabaña</label>
                <input type="text" formControlName="nombreCabana" class="input-field">
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" formControlName="email" class="input-field bg-gray-200" readonly>
                <p class="text-xs text-gray-500 mt-1">Este es el email de su cuenta y no se puede cambiar.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                    <input type="text" formControlName="telefono" class="input-field">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Provincia</label>
                    <input type="text" formControlName="provincia" class="input-field">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Localidad</label>
                    <input type="text" formControlName="localidad" class="input-field">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Departamento</label>
                    <input type="text" formControlName="departamento" class="input-field">
                </div>
            </div>

            <button type="submit" 
                [disabled]="expositorForm.invalid || loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50">
                {{ loading ? 'Registrando...' : 'Completar Registro' }}
            </button>

            </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-field {
        @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline;
    }
  `]
})
export class RegisterExpositorComponent implements OnInit {
  expositorForm: FormGroup;
  loginForm: FormGroup;
  loading = false;
  userEmail: string = '';
  isLoggedIn = false;
  magicLinkSent = false;

  constructor(
    private fb: FormBuilder,
    private expositoresService: ExpositoresService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.expositorForm = this.fb.group({
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

  async ngOnInit() {
    // 0. Wait for session to initialize
    await this.authService.ensureSessionLoaded();

    // 1. Check logged in status
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.checkExistingProfile();
    }
  }

  checkExistingProfile() {
    const user = this.authService.currentUserValue;
    if (user && user.email) {
      this.userEmail = user.email;
      this.expositorForm.patchValue({ email: this.userEmail });
      this.expositorForm.get('email')?.disable();

      this.loading = true;
      this.expositoresService.getProfile().subscribe({
        next: (expositor) => {
          this.loading = false;
          if (expositor) {
            // Already registered, go to animals
            this.router.navigate(['/animals/new']);
          }
        },
        error: (err) => {
          this.loading = false;
          // Not registered (404), allow to fill form
        }
      });
    }
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email } = this.loginForm.value;

    try {
      await this.authService.login(email); // Magic Link
      this.magicLinkSent = true;
    } catch (error) {
      console.error(error);
      alert('Error al enviar el enlace. Intente nuevamente.');
    } finally {
      this.loading = false;
    }
  }

  getError(controlName: string) {
    const control = this.expositorForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit() {
    if (this.expositorForm.valid) {
      this.loading = true;
      // Re-enable email to include it in the value
      this.expositorForm.get('email')?.enable();
      const expositorData: Expositor = this.expositorForm.value;
      this.expositorForm.get('email')?.disable();

      this.expositoresService.create(expositorData).subscribe({
        next: () => {
          this.loading = false;
          alert('¡Registro completado! Ahora puede registrar sus animales.');
          this.router.navigate(['/animals/new']); // Redirect to animal registration
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          let msg = 'Error al registrar';
          if (err.status === 409) msg = 'Ya existe un expositor con este CUIT.';
          alert(msg);
        }
      });
    } else {
      this.expositorForm.markAllAsTouched();
    }
  }
}
