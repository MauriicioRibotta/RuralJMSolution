# RuralIA - Backend Ganadero

Este es el backend del sistema RuralIA, construido con **NestJS**. Sigue una arquitectura modular y limpia para facilitar el mantenimiento y escalabilidad.

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado en **Módulos**. Cada módulo encapsula una funcionalidad específica del negocio.

### Estructura de Carpetas (`src/`)

```
src/
├── app.module.ts            # 🧠 Cerebro de la aplicación. Une todos los módulos.
├── main.ts                  # 🚀 Punto de entrada. Inicia el servidor.
├── animals/                 # 🐄 MÓDULO PRINCIPAL: Gestión de Animales
│   ├── animals.module.ts    # Agrupa todo lo relacionado con animales.
│   ├── controllers/         # 📡 API: Reciben las peticiones HTTP (GET, POST).
│   │   └── animals.controller.ts
│   ├── services/            # ⚙️ LÓGICA: Reglas de negocio y conexión a DB.
│   │   └── animals.service.ts
│   ├── entities/            # 🧬 MODELO: Definición de cómo es un "Animal".
│   │   └── animal.entity.ts
│   └── dto/                 # 📦 DATOS: Estructura de datos para crear/editar (Data Transfer Objects).
│       └── create-animal.dto.ts
├── common/                  # 🛠️ UTILIDADES COMPARTIDAS
│   ├── common.module.ts
│   └── excel.service.ts     # Servicio especializado en generar reportes Excel complejos.
└── supabase/                # ☁️ CONEXIÓN BASE DE DATOS
    └── supabase.module.ts   # Cliente global de Supabase.
```

## 🧩 Explicación de Componentes

### 1. Controllers (`*.controller.ts`)
Son la "puerta de entrada".
- **AnimalsController:**
  - `POST /animals`: Recibe los datos de un animal nuevo.
  - `GET /animals`: Devuelve todos los animales.
  - `GET /animals/export`: Genera y descarga el Excel para el jurado.

### 2. Services (`*.service.ts`)
Aquí vive la lógica real.
- **AnimalsService:** Usa el cliente de Supabase para insertar o buscar datos en la tabla `animals`.
- **ExcelService:** Usa la librería `exceljs` para dibujar celda por celda el reporte, aplicar estilos, colores y bordes.

### 3. Entities (`*.entity.ts`)
Representan tablas de la base de datos o conceptos del negocio.
- **Animal:** Define que un animal tiene `id`, `nombre`, `raza`, `rp`, etc.

### 4. DTOs (`*.dto.ts`)
Son "validadores". Aseguran que los datos que llegan desde el Frontend sean correctos antes de procesarlos.
- **CreateAnimalDto:** Verifica que el animal tenga nombre, raza, etc., y que los tipos de datos sean correctos.

### 5. Supabase Module
Un módulo global que crea una única conexión (Singleton) con Supabase y la comparte con toda la aplicación.

## 🚀 Tecnologías Clave

- **NestJS:** Framework principal.
- **Supabase (PostgreSQL):** Base de datos en la nube.
- **ExcelJS:** Generación profesional de archivos .xlsx.
- **Class-Validator:** Validación de datos entrantes.

## 🛠️ Comandos Útiles

```bash
# Iniciar en desarrollo
npm run start:dev

# Compilar para producción
npm run build
```
