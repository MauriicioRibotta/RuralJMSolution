import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalsService } from '../../services/animals.service';
import { Animal } from '../../interfaces/animal.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <div class="space-x-4">
          <a routerLink="/animals/new" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            + Nuevo Animal
          </a>
          <button (click)="logout()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div class="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">RP</th>
              <th class="py-3 px-6 text-left">Nombre</th>
              <th class="py-3 px-6 text-left">Raza</th>
              <th class="py-3 px-6 text-left">Categoría</th>
              <th class="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr *ngFor="let animal of animals" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 text-left whitespace-nowrap">
                <span class="font-medium">{{ animal.rp }}</span>
              </td>
              <td class="py-3 px-6 text-left">
                <span>{{ animal.nombre }}</span>
              </td>
              <td class="py-3 px-6 text-left">
                <span>{{ animal.raza }}</span>
              </td>
              <td class="py-3 px-6 text-left">
                <span>{{ animal.categoria }}</span>
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center">
                  <a [routerLink]="['/admin/edit', animal.id]" class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </a>
                  <button (click)="deleteAnimal(animal.id!)" class="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  animals: Animal[] = [];

  constructor(
    private animalsService: AnimalsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals() {
    this.animalsService.findAll().subscribe(data => {
      this.animals = data;
    });
  }

  deleteAnimal(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este animal?')) {
      this.animalsService.delete(id).subscribe(() => {
        this.animals = this.animals.filter(a => a.id !== id);
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
