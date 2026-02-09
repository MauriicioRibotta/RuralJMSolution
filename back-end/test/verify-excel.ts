
import { ExcelService } from '../src/common/excel.service';
import { Animal } from '../src/animals/entities/animal.entity';
import * as fs from 'fs';

async function verifyExcel() {
    console.log('Validando generación de Excel...');
    const excelService = new ExcelService();

    const mockAnimals: Animal[] = [
        new Animal({ id: '1', nombre: 'Toro Campeón', raza: 'Angus', categoria: 'Toros', rp: 'A100', activo: true }),
        new Animal({ id: '2', nombre: 'Vaca Lechera', raza: 'Holando', categoria: 'Vacas', rp: 'B200', activo: true }),
        new Animal({ id: '3', nombre: 'Ternero', raza: 'Hereford', categoria: 'Terneros', rp: 'C300', activo: false }),
    ];

    try {
        const buffer = await excelService.generateAnimalsReport(mockAnimals);
        fs.writeFileSync('test-report.xlsx', buffer);
        console.log('✅ Excel generado exitosamente: test-report.xlsx');
    } catch (error) {
        console.error('❌ Error generando Excel:', error);
    }
}

verifyExcel();
