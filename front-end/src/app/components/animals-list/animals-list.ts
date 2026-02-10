import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalsService } from '../../services/animals.service';
import { Animal } from '../../interfaces/animal.interface';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-animals-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './animals-list.html'
})
export class AnimalsListComponent implements OnInit {
    animals$!: Observable<Animal[]>;

    constructor(private animalsService: AnimalsService) { }

    ngOnInit() {
        this.animals$ = this.animalsService.findAll();
    }

    exportExcel() {
        this.animalsService.exportExcel();
    }
}
