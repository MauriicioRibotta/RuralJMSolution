
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimalsService } from '../../services/animals.service';
import { CatalogosService } from '../../services/catalogos.service';
import { RegistrationStateService, ExpositorState } from '../../services/registration-state.service';
import { Especie, Raza, TipoInscripcion } from '../../interfaces/catalogos.interface';
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
  currentExpositor: ExpositorState | null = null;

  // Catalogos
  especies: Especie[] = [];
  razas: Raza[] = [];
  razasFiltradas: Raza[] = [];
  tiposInscripcion: TipoInscripcion[] = [];

  constructor(
    private fb: FormBuilder,
    private animalsService: AnimalsService,
    private catalogosService: CatalogosService,
    private stateService: RegistrationStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.animalForm = this.fb.group({
      expositorId: ['', Validators.required],
      razaId: ['', Validators.required],
      tipoInscripcionId: [1, Validators.required],
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
  }

  ngOnInit(): void {
    // 1. Verify State
    this.currentExpositor = this.stateService.currentExpositor;
    if (!this.currentExpositor) {
      // Redirect to step 1 if no expositor allowed
      alert('Debe identificar al expositor primero.');
      this.router.navigate(['/inscripcion/expositor']);
      return;
    }

    // Set expositor ID
    this.animalForm.patchValue({ expositorId: this.currentExpositor.id });

    // 2. Load Catalogs
    this.loadCatalogos();

    // 3. Check if editing existing animal
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentAnimalId = id;
      this.loadAnimal(id);
    }
  }

  loadCatalogos() {
    this.catalogosService.getEspecies().subscribe(data => this.especies = data);
    this.catalogosService.getRazas().subscribe(data => this.razas = data);
    this.catalogosService.getTiposInscripcion().subscribe(data => this.tiposInscripcion = data);
  }

  onEspecieChange(event: any) {
    const especieId = Number(event.target.value);
    this.razasFiltradas = this.razas.filter(r => r.especie_id == especieId);
    this.animalForm.get('razaId')?.reset();
  }

  loadAnimal(id: string) {
    this.animalsService.getById(id).subscribe({
      next: (animal) => {
        // Verify ownership?
        if (animal.expositorId !== this.currentExpositor?.id) {
          alert('No tienes permiso para editar este animal.');
          this.router.navigate(['/animals']);
          return;
        }

        this.animalForm.patchValue({
          ...animal,
          fechaNacimiento: animal.fechaNacimiento ? animal.fechaNacimiento.split('T')[0] : ''
        });

        // Trigger filtering
        if (animal.raza && animal.raza.especie_id) {
          this.razasFiltradas = this.razas.filter(r => r.especie_id === animal.raza!.especie_id);
        } else {
          this.razasFiltradas = this.razas;
        }
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.animalForm.valid) {
      const animalData = this.animalForm.value;

      // Ensure expositorId is set from state, not just form (security)
      animalData.expositorId = this.currentExpositor?.id;

      animalData.razaId = Number(animalData.razaId);
      animalData.tipoInscripcionId = Number(animalData.tipoInscripcionId);

      // Sanitize empty strings
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
          alert('Animal guardado correctamente.');
          // Redirect to Summary or Ask to add another?
          // For now, let's go to summary which allows adding more
          this.router.navigate(['/inscripcion/resumen']);
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

