import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { AnimalsService } from '../services/animals.service';
import { CreateAnimalDto } from '../dto/create-animal.dto';
import { UpdateAnimalDto } from '../dto/update-animal.dto';
import { ExcelService } from '../../common/excel.service';

@Controller('animals')
@UseGuards(ThrottlerGuard)
export class AnimalsController {
    constructor(
        private readonly animalsService: AnimalsService,
        private readonly excelService: ExcelService,
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createAnimalDto: CreateAnimalDto, @Req() req: any) {
        return this.animalsService.create(createAnimalDto, req.user?.email);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Req() req: any, @Query('cuit') cuit?: string) {
        return this.animalsService.findAll(req.user?.email, cuit);
    }

    @Get('export')
    async exportToExcel(@Res() res: Response) {
        const animals = await this.animalsService.findAll();
        const buffer = await this.excelService.generateAnimalsReport(animals);

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=Listado_Jurado.xlsx',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.animalsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
        return this.animalsService.update(id, updateAnimalDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.animalsService.remove(id);
    }
}
