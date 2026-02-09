import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          RuralIA <span class="text-blue-600">Gestión</span>
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          Sistema integral para la inscripción y admisión de animales en la Exposición Rural de Jesús María.
        </p>

        <div class="flex flex-col md:flex-row justify-center gap-4">
          <a routerLink="/inscripcion/expositor" class="block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
            📝 Inscribir Mis Animales
          </a>
        </div>
        
        <div class="mt-8">
            <a routerLink="/login" class="text-blue-600 hover:underline">Acceso Administrativo</a>
        </div>
      </div>
      
      <footer class="mt-8 text-gray-500 text-sm">
        &copy; 2026 Sociedad Rural de Jesús María
      </footer>
    </div>
  `
})
export class HomeComponent { }
