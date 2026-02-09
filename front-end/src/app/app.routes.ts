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
import { ExpositorFormComponent } from './components/expositor-form/expositor-form.component';
import { RegistrationSummaryComponent } from './pages/registration-summary/registration-summary.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    // New Registration Flow
    { path: 'inscripcion/expositor', component: ExpositorFormComponent },
    { path: 'inscripcion/animales', component: AnimalFormComponent },
    { path: 'inscripcion/resumen', component: RegistrationSummaryComponent },

    // Keep legacy for now or redirect
    { path: 'login', redirectTo: 'inscripcion/expositor' },
    { path: 'register-expositor', redirectTo: 'inscripcion/expositor' },
    { path: 'animals/new', redirectTo: 'inscripcion/animales' },

    // Admin
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard]
    },
    // ... potentially other admin routes
    {
        path: 'expositores',
        component: ExpositoresListComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'catalogos',
        component: CatalogosManagerComponent,
        canActivate: [AdminGuard]
    }
];
