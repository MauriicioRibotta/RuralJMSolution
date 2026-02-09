import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches, IsInt, IsDateString, IsUUID, IsNumber, IsIn } from 'class-validator';

export class CreateAnimalDto {
    @IsUUID()
    @IsNotEmpty()
    expositorId: string;

    @IsInt()
    @IsNotEmpty()
    razaId: number;

    @IsInt()
    @IsNotEmpty()
    tipoInscripcionId: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9-]+$/, { message: 'RP must contain only uppercase letters, numbers, and hyphens' })
    @MinLength(1)
    @MaxLength(50)
    rp: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    nombre?: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['Macho', 'Hembra'])
    sexo: string;

    @IsDateString()
    @IsOptional()
    fechaNacimiento?: string;

    @IsInt()
    @IsOptional()
    loteNro?: number;

    @IsInt()
    @IsOptional()
    ordenCatalogo?: number;

    @IsBoolean()
    @IsOptional()
    venta?: boolean = false;

    @IsBoolean()
    @IsOptional()
    aceptaTerminos?: boolean = true;

    // Polymorphic fields
    @IsString()
    @IsOptional()
    registroAsociacion?: string;

    @IsString()
    @IsOptional()
    registroPadre?: string;

    @IsString()
    @IsOptional()
    registroMadre?: string;

    @IsDateString()
    @IsOptional()
    fechaServicio?: string;

    @IsString()
    @IsOptional()
    categoria?: string;

    @IsString()
    @IsOptional()
    @IsIn(['Titular', 'Suplente'])
    reemplazanteTipo?: string;

    // Biometrics
    @IsNumber()
    @IsOptional()
    pesoNacimiento?: number;

    @IsNumber()
    @IsOptional()
    pesoActual?: number;

    @IsNumber()
    @IsOptional()
    circunferenciaEscrotal?: number;

    @IsString()
    @IsOptional()
    observaciones?: string;
}
