import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExpositoresService } from '../../services/expositores.service';
import { Expositor } from '../../interfaces/expositor.interface';

@Component({
    selector: 'app-expositores-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './expositores-form.component.html',
    styles: [`
    .input-field {
        @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline;
    }
  `]
})
export class ExpositoresFormComponent implements OnInit {
    expositorForm: FormGroup;
    isEditMode = false;
    currentId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private expositoresService: ExpositoresService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.expositorForm = this.fb.group({
            cuit: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            razon_social: ['', Validators.required],
            nombre_cabana: ['', Validators.required],
            email: ['', [Validators.email]],
            telefono: [''],
            provincia: [''],
            localidad: [''],
            departamento: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.currentId = id;
            this.loadExpositor(id);
        }
    }

    loadExpositor(id: string) {
        this.expositoresService.getById(id).subscribe({
            next: (expositor) => {
                this.expositorForm.patchValue(expositor);
            },
            error: (err) => console.error(err)
        });
    }

    onSubmit() {
        if (this.expositorForm.valid) {
            const expositor: Expositor = this.expositorForm.value;
            const request$ = this.isEditMode && this.currentId
                ? this.expositoresService.update(this.currentId, expositor)
                : this.expositoresService.create(expositor);

            request$.subscribe({
                next: () => {
                    alert('Expositor guardado correctamente');
                    this.router.navigate(['/expositores']);
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al guardar expositor');
                }
            });
        }
    }
}
