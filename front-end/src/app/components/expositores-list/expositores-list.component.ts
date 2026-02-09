import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpositoresService } from '../../services/expositores.service';
import { Expositor } from '../../interfaces/expositor.interface';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-expositores-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './expositores-list.component.html'
})
export class ExpositoresListComponent implements OnInit {
    expositores$!: Observable<Expositor[]>;

    constructor(private expositoresService: ExpositoresService) { }

    ngOnInit() {
        this.loadExpositores();
    }

    loadExpositores() {
        this.expositores$ = this.expositoresService.findAll();
    }

    deleteExpositor(id: string) {
        if (confirm('¿Está seguro de que desea eliminar este expositor?')) {
            this.expositoresService.delete(id).subscribe(() => {
                this.loadExpositores();
            });
        }
    }
}
