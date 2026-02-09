
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Falta SUPABASE_URL o SUPABASE_KEY en el archivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
    console.log('🔌 Conectando a Supabase...');

    const testAnimal = {
        nombre: 'Animal de Prueba',
        raza: 'Test',
        categoria: 'Test',
        rp: 'TEST-001',
        activo: true
    };

    try {
        // 1. Insertar
        const { data, error: insertError } = await supabase
            .from('animals')
            .insert([testAnimal])
            .select()
            .single();

        if (insertError) {
            throw new Error(`Error al insertar: ${insertError.message}`);
        }
        console.log('✅ Inserción exitosa:', data);

        // 2. Leer
        const { data: animals, error: selectError } = await supabase
            .from('animals')
            .select('*')
            .limit(1);

        if (selectError) {
            throw new Error(`Error al leer: ${selectError.message}`);
        }
        console.log('✅ Lectura exitosa. Animales encontrados:', animals.length);

        console.log('🎉 ¡Conexión a Supabase verificada correctamente!');

    } catch (error) {
        console.error('❌ Falló la verificación:', error);
    }
}

verifyConnection();
