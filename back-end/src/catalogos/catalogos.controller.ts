import { Controller, Get, UseGuards } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('catalogos')
@UseGuards(ThrottlerGuard)
export class CatalogosController {
    constructor(private readonly catalogosService: CatalogosService) { }

    @Get('especies')
    findAllEspecies() {
        return this.catalogosService.findAllEspecies();
    }

    @Get('razas')
    findAllRazas() {
        return this.catalogosService.findAllRazas();
    }

    @Get('tipos-inscripcion')
    findAllTiposInscripcion() {
        return this.catalogosService.findAllTiposInscripcion();
    }
}
