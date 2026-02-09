import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateExpositorDto {
    @IsString()
    @IsNotEmpty()
    @Length(11, 11, { message: 'CUIT must be exactly 11 characters' })
    @Matches(/^[0-9]+$/, { message: 'CUIT must contain only numbers' })
    cuit: string;

    @IsString()
    @IsNotEmpty()
    razonSocial: string;

    @IsString()
    @IsNotEmpty()
    nombreCabana: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsString()
    @IsOptional()
    provincia?: string;

    @IsString()
    @IsOptional()
    localidad?: string;

    @IsString()
    @IsOptional()
    departamento?: string;
}
