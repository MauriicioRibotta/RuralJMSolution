import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class ExcelService {
    async generateAnimalsReport(animals: Animal[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilla de Admisión');

        // Configurar columnas del Jurado
        worksheet.columns = [
            { header: 'Lote', key: 'lote', width: 8 },
            { header: 'Catálogo', key: 'orden', width: 10 },
            { header: 'RP', key: 'rp', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Raza', key: 'raza', width: 15 },
            { header: 'Sexo', key: 'sexo', width: 10 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Expositor', key: 'expositor', width: 30 },
            // Columnas para el jurado (vacías para llenar a mano o checkear)
            { header: 'Peso (Kg)', key: 'peso', width: 15 },
            { header: 'CE (cm)', key: 'ce', width: 10 },
            { header: 'Obs. Admisión', key: 'observaciones', width: 30 },
            { header: 'Aprobado', key: 'aprobado', width: 10 },
        ];

        // Estilo de cabecera profesional
        worksheet.getRow(1).font = { name: 'Arial', family: 4, size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E78' }, // Azul oscuro corporativo
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Agregar datos
        animals.forEach((animal) => {
            const row = worksheet.addRow({
                lote: animal.lote_nro,
                orden: animal.orden_catalogo,
                rp: animal.rp,
                nombre: animal.nombre_animal, // Mapped correctly
                raza: animal.raza?.nombre || '', // Nested object access
                sexo: animal.sexo,
                categoria: animal.categoria,
                expositor: animal.expositor?.nombre_cabana || '', // Nested object access
                peso: animal.peso_actual,
                ce: animal.circunferencia_escrotal,
            });

            // Bordes finos para cada celda
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Generar Buffer
        const uint8Array = await workbook.xlsx.writeBuffer();
        return Buffer.from(uint8Array);
    }
}
