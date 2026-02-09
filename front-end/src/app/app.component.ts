import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="bg-gray-800 p-4 text-white">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold hover:text-gray-300">RuralIA</a>
        <div class="space-x-4">
          <a routerLink="/animals/new" class="hover:text-blue-300 transition">Inscribir</a>
          <a routerLink="/animals" class="hover:text-green-300 transition">Listado</a>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class App { }
