import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AnimalFormComponent } from './components/animal-form/animal-form';
import { AnimalsListComponent } from './components/animals-list/animals-list';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { ExpositoresListComponent } from './components/expositores-list/expositores-list.component';
import { ExpositoresFormComponent } from './components/expositores-form/expositores-form.component';
import { CatalogosManagerComponent } from './components/catalogos-manager/catalogos-manager.component';
import { RegisterExpositorComponent } from './components/register-expositor/register-expositor.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register-expositor', component: RegisterExpositorComponent },
    { path: 'animals/new', component: AnimalFormComponent },
    { path: 'animals', component: AnimalsListComponent },

    // Expositores
    {
        path: 'expositores',
        component: ExpositoresListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'expositores/new',
        component: ExpositoresFormComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'expositores/edit/:id',
        component: ExpositoresFormComponent,
        canActivate: [AdminGuard]
    },

    // Catalogos
    {
        path: 'catalogos',
        component: CatalogosManagerComponent,
        canActivate: [AdminGuard]
    },

    // Admin
    {
        path: 'admin/edit/:id',
        component: AnimalFormComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard]
    },
];
