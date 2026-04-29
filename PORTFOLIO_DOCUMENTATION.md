# 📋 Documentación - Sección de Portafolio

## 🎯 Resumen

Se ha implementado una nueva sección de **Portafolio** con carga de archivos, permitiendo a los usuarios subir y gestionar documentos, planos PDF, imágenes y otros archivos para su portafolio profesional.

## ✨ Características Principales

### 1. **Carga de Archivos (Upload)**
- **Drag & Drop**: Arrastra archivos directamente a la zona de carga
- **Selección Manual**: Botón "Seleccionar Archivo" para elegir archivos
- **Tipos Permitidos**:
  - PDF (`.pdf`)
  - Documentos Word (`.doc`, `.docx`)
  - Hojas de cálculo Excel (`.xls`, `.xlsx`)
  - Imágenes (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`)

### 2. **Gestión de Archivos**
Una vez cargados, cada archivo se muestra con:
- **Icono**: Identifica el tipo de archivo (PDF, DOC, XLS, IMG)
- **Nombre**: Nombre completo del archivo
- **Tamaño**: En formato legible (Bytes, KB, MB, GB)
- **Fecha**: Fecha y hora de carga
- **Acciones**:
  - 👁️ **Ver**: Abre el archivo en una nueva pestaña (PDFs e imágenes)
  - ⬇️ **Descargar**: Descarga el archivo
  - ❌ **Eliminar**: Remueve el archivo de la lista

### 3. **Interfaz Minimalista**
- Diseño limpio y profesional
- Feedback visual interactivo (hover, drag states)
- Indicador de cantidad de archivos
- Mensaje vacío cuando no hay archivos

## 📁 Archivos Creados

### `src/components/PortfolioUpload.tsx`
Componente React que maneja:
- Estado de archivos con TypeScript
- Validación de tipos MIME
- Formateo de tamaño y fecha
- Operaciones de carga, descarga y eliminación

## 🔧 Integración en App.tsx

1. **Importación** del componente `PortfolioUpload`
2. **Navegación**: Se añadió "Portfolio" al menú de navegación
3. **Nueva Sección**: `<section id="portfolio">` entre Projects y Skills
4. **Descripción**: 
   - Etiqueta: "FILE MANAGEMENT"
   - Título: "Upload Documents & Files"
   - Descripción sobre gestión de archivos de portafolio

## 🎨 Estilos Aplicados

- Colores del sistema: `apple-gray`, `foreground`
- Bordes redondeados: `rounded-2xl`
- Espaciado: `py-20 lg:py-32` (sección), `p-8 lg:p-12` (contenedor)
- Animaciones: Transiciones suaves en hover, cambios de estado
- Responsivo: Adaptado para móvil, tablet y desktop

## 📝 Restricciones

- **Tamaño máximo** por archivo: 50MB (configurable)
- **Tipos permitidos**: PDF, Word, Excel, imágenes
- **Validación**: Rechaza archivos no permitidos con alerta

## 🚀 Cómo Usar

1. **Navegar**: Click en "Portfolio" en el menú o desplazarse hasta la sección
2. **Cargar archivos**:
   - Arrastra archivos a la zona punteada, O
   - Haz click en "Seleccionar Archivo"
3. **Ver archivos**: Se mostrarán en la lista debajo
4. **Acciones**: Click en los botones para ver, descargar o eliminar

## 💻 Tecnologías

- **React 19** + TypeScript
- **Lucide React** (iconos)
- **Tailwind CSS** (estilos)
- **Radix UI** (componentes base)

## 🔄 Próximas Mejoras (Opcionales)

- Persistencia en base de datos
- Compresión automática de imágenes
- Vista previa de imágenes en miniatura
- Organización en carpetas
- Búsqueda y filtro de archivos
- Sincronización con cloud storage

---

✅ **Estado**: Completado y funcionando correctamente
📱 **Dispositivos**: Totalmente responsivo
🎯 **Usuario**: Español (interfaz en español)
