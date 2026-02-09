import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AnimalsService, Animal } from '../../services/animals.service';
import { CatalogosService } from '../../services/catalogos.service';
import { ExpositoresService } from '../../services/expositores.service';
import { AuthService } from '../../services/auth.service';
import { Especie, Raza, TipoInscripcion } from '../../interfaces/catalogos.interface';
import { Expositor } from '../../interfaces/expositor.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-form.html',
  styleUrls: ['./animal-form.css']
})
export class AnimalFormComponent implements OnInit {
  animalForm: FormGroup;
  isEditMode = false;
  currentAnimalId: string | null = null;

  // Catalogos
  especies: Especie[] = [];
  razas: Raza[] = [];
  razasFiltradas: Raza[] = [];
  tiposInscripcion: TipoInscripcion[] = [];

  // Expositor Logic
  cuitControl = new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
  expositorForm: FormGroup;
  expositorEncontrado: Expositor | null = null;
  mostrarFormExpositor = false;

  constructor(
    private fb: FormBuilder,
    private animalsService: AnimalsService,
    private catalogosService: CatalogosService,
    private expositoresService: ExpositoresService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.animalForm = this.fb.group({
      expositorId: ['', Validators.required],
      razaId: ['', Validators.required],
      tipoInscripcionId: [1, Validators.required], // Default to what is most common if needed
      rp: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Z0-9-]+$/)
      ]],
      nombre: [''],
      sexo: ['Macho', Validators.required],
      fechaNacimiento: [''],
      loteNro: [null],
      ordenCatalogo: [null],
      venta: [false],
      aceptaTerminos: [true, Validators.requiredTrue],

      // Dynamic
      registroAsociacion: [''],
      registroPadre: [''],
      registroMadre: [''],
      fechaServicio: [''],
      categoria: [''],
      reemplazanteTipo: [''],
      pesoNacimiento: [null],
      pesoActual: [null],
      circunferenciaEscrotal: [null],
      observaciones: ['']
    });

    this.expositorForm = this.fb.group({
      razonSocial: ['', Validators.required],
      nombreCabana: ['', Validators.required],
      email: ['', [Validators.email]],
      telefono: ['']
    });
  }

  ngOnInit(): void {
    this.loadCatalogos();
    this.checkProfile();

    // Check if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentAnimalId = id;
      this.loadAnimal(id);
    }
  }

  checkProfile() {
    this.expositoresService.getProfile().subscribe({
      next: (expositor) => {
        if (expositor) {
          console.log('Logged in as Expositor:', expositor);
          this.expositorEncontrado = expositor;
          this.animalForm.patchValue({ expositorId: expositor.id });
          this.cuitControl.setValue(expositor.cuit);
          this.cuitControl.disable(); // Disable search
          this.mostrarFormExpositor = false;
        }
      },
      error: (err) => {
        // Not an expositor (e.g. Admin or new user)
        // If new user, they might need to register, but here we just let them use the search if allowed.
        // Or if we want to enforce flow:
        console.log('Not an expositor or profile not found');
      }
    });
  }

  loadCatalogos() {
    this.catalogosService.getEspecies().subscribe(data => this.especies = data);
    this.catalogosService.getRazas().subscribe(data => this.razas = data);
    this.catalogosService.getTiposInscripcion().subscribe(data => this.tiposInscripcion = data);
  }

  onEspecieChange(event: any) {
    const especieId = Number(event.target.value);
    console.log('Species selected:', especieId);
    console.log('All breeds loaded:', this.razas);

    if (!this.razas || this.razas.length === 0) {
      console.warn('No breeds loaded! Check network tab or backend.');
    }

    this.razasFiltradas = this.razas.filter(r => r.especie_id == especieId);
    console.log('Filtered breeds:', this.razasFiltradas);

    this.animalForm.get('razaId')?.reset();
  }

  buscarExpositor() {
    if (this.cuitControl.invalid) {
      alert('Ingrese un CUIT válido (11 números)');
      return;
    }
    const cuit = this.cuitControl.value!;
    this.expositoresService.getByCuit(cuit).subscribe({
      next: (expositor) => {
        if (expositor) {
          this.expositorEncontrado = expositor;
          this.animalForm.patchValue({ expositorId: expositor.id });
          this.mostrarFormExpositor = false;
        } else {
          this.expositorEncontrado = null;
          this.mostrarFormExpositor = true;
          // Optional: alert('Expositor no encontrado. Complete los datos.');
        }
      },
      error: (err) => {
        console.error('Error fetching expositor:', err);
        // Fallback for real errors (500 etc)
        this.expositorEncontrado = null;
        this.mostrarFormExpositor = true;
      }
    });
  }

  crearExpositor() {
    if (this.expositorForm.invalid) return;

    const nuevoExpositor: Expositor = {
      ...this.expositorForm.value,
      cuit: this.cuitControl.value
    };

    this.expositoresService.create(nuevoExpositor).subscribe({
      next: (expositor) => {
        this.expositorEncontrado = expositor;
        this.animalForm.patchValue({ expositorId: expositor.id });
        this.mostrarFormExpositor = false;
        alert('Expositor registrado con éxito');
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear expositor');
      }
    });
  }

  loadAnimal(id: string) {
    this.animalsService.getById(id).subscribe({
      next: (animal) => {
        this.expositorEncontrado = animal.expositor || null;
        if (this.expositorEncontrado) {
          this.cuitControl.setValue(this.expositorEncontrado.cuit);
        }

        this.animalForm.patchValue({
          ...animal,
          fechaNacimiento: animal.fechaNacimiento ? animal.fechaNacimiento.split('T')[0] : ''
        });

        // Trigger filtering
        if (animal.raza && animal.raza.especie_id) {
          this.razasFiltradas = this.razas.filter(r => r.especie_id === animal.raza!.especie_id);
        } else {
          // Fallback if relation not loaded deeply
          this.razasFiltradas = this.razas;
        }
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.animalForm.valid) {
      const animalData = this.animalForm.value;

      // Convert select values to numbers if needed (Angular reactive forms usually handles this if value is number)
      animalData.razaId = Number(animalData.razaId);
      animalData.tipoInscripcionId = Number(animalData.tipoInscripcionId);

      // Sanitize empty strings to null for optional fields
      Object.keys(animalData).forEach(key => {
        if (typeof animalData[key] === 'string' && animalData[key].trim() === '') {
          animalData[key] = null;
        }
      });

      const request$ = this.isEditMode && this.currentAnimalId
        ? this.animalsService.update(this.currentAnimalId, animalData)
        : this.animalsService.create(animalData);

      request$.subscribe({
        next: () => {
          alert('Operación exitosa');
          this.router.navigate(['/animals']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al guardar: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.animalForm.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos');
    }
  }

  get esPedigree(): boolean {
    // Assuming ID 1 is Pedigree, adjust based on DB or check name
    const tipoId = this.animalForm.get('tipoInscripcionId')?.value;
    // Ideally we check against the loaded types array found by name 'Puro de Pedigree'
    const tipo = this.tiposInscripcion.find(t => t.id == tipoId);
    return tipo ? tipo.nombre.includes('Pedigree') : false;
  }

  getError(controlName: string) {
    const control = this.animalForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
