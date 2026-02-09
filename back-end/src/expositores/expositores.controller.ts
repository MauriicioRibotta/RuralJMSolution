import { Controller, Get, Post, Body, Patch, Param, UseGuards, ConflictException, NotFoundException, Req } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { ExpositoresService } from './expositores.service';
import { CreateExpositorDto } from './dto/create-expositor.dto';
import { UpdateExpositorDto } from './dto/update-expositor.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('expositores')
@UseGuards(ThrottlerGuard)
export class ExpositoresController {
    constructor(private readonly expositoresService: ExpositoresService) { }

    @Post()
    async create(@Body() createExpositorDto: CreateExpositorDto) {
        const existing = await this.expositoresService.findOneByCuit(createExpositorDto.cuit);
        if (existing) {
            throw new ConflictException('Expositor with this CUIT already exists');
        }
        return this.expositoresService.create(createExpositorDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: any) {
        const email = req.user.email;
        const expositor = await this.expositoresService.findOneByEmail(email);
        if (!expositor) {
            // It is valid to not have a profile yet (e.g. new user)
            // returning null or 404 is a design choice. 
            // 404 might be cleaner for "not found" checks in frontend.
            throw new NotFoundException('Expositor profile not found for this user');
        }
        return expositor;
    }

    @Get()
    findAll() {
        return this.expositoresService.findAll();
    }

    @Get('cuit/:cuit')
    async findOneByCuit(@Param('cuit') cuit: string) {
        const expositor = await this.expositoresService.findOneByCuit(cuit);
        return expositor;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.expositoresService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExpositorDto: UpdateExpositorDto) {
        return this.expositoresService.update(id, updateExpositorDto);
    }
}
