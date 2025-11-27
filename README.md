# Sistema de Evaluación de Impacto de Capacitación

## 📝 Descripción

Este proyecto es un frontend en **Angular** que implementa un sistema híbrido de evaluación del impacto de capacitación que combina **Lógica Difusa** y **Sistemas Expertos** basados en **Prolog**.

El sistema evalúa el impacto de programas de capacitación en tres niveles:
- **Impacto Individual**: Basado en satisfacción, aprendizaje y desempeño
- **Impacto Organizacional**: Basado en clima, disciplina y factores económicos  
- **Impacto Total**: Combinación integral de los niveles anteriores

## 🌐 Navegación del Sistema

### **Estructura de la Aplicación:**

#### **1. Sección Evaluación (`/evaluacion`)**
- **Formulario de entrada** con 6 variables de impacto
- **Resultados en tiempo real** con métricas visuales
- **Gráficos interactivos** de funciones de pertenencia
- **Análisis completo** del impacto individual y organizacional

#### **2. Sección Información (`/informacion`)**
- **Visión General**: Arquitectura del sistema híbrido
- **Lógica Difusa**: Variables y conjuntos difusos detallados
- **Sistema Experto**: Base de conocimiento y reglas Prolog
- **Metodología**: Proceso de evaluación y validación

## 🚀 Tecnologías Utilizadas

### Frontend (Angular)
- **Angular 17+** con Standalone Components
- **Angular Material** para UI components
- **TypeScript** para type safety
- **RxJS** para programación reactiva
- **SCSS** para estilos

### Backend (Sistema Original)
- **Python** con NumPy para lógica difusa
- **Prolog (PySwip)** para sistemas expertos

## 🛠️ Comandos de Desarrollo

### Servidor de desarrollo
```bash
ng serve
```
Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo fuente.

### Generar componentes
```bash
ng generate component component-name
```
También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build para producción
```bash
ng build
```
Los artefactos del build se almacenarán en el directorio `dist/`.

### Ejecutar tests unitarios
```bash
ng test
```
Ejecuta las pruebas unitarias via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
