import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationComponent {
  // Variables para las reglas del sistema experto
  expertoRules = [
    {
      categoria: 'Impacto Individual Alto',
      reglas: [
        'Si Satisfacción > 80 y Aprendizaje > 75 → Impacto Individual Alto',
        'Si Desempeño > 85 y Satisfacción > 70 → Impacto Individual Alto',
        'Si Aprendizaje > 90 → Impacto Individual Alto (independiente de otras variables)'
      ]
    },
    {
      categoria: 'Impacto Organizacional Alto',
      reglas: [
        'Si Clima Laboral > 75 y Disciplina > 80 → Impacto Organizacional Alto',
        'Si Económicos > 85 y Clima Laboral > 70 → Impacto Organizacional Alto',
        'Si Disciplina > 90 y Económicos > 75 → Impacto Organizacional Alto'
      ]
    },
    {
      categoria: 'Impacto Total',
      reglas: [
        'Si Impacto Individual = Alto y Impacto Organizacional = Alto → Impacto Total = Muy Alto',
        'Si (Impacto Individual = Alto y Impacto Organizacional = Medio) o (Impacto Individual = Medio y Impacto Organizacional = Alto) → Impacto Total = Alto',
        'Si Impacto Individual = Medio y Impacto Organizacional = Medio → Impacto Total = Medio'
      ]
    }
  ];

  // Variables de entrada para lógica difusa
  fuzzyVariables = [
    {
      nombre: 'Satisfacción',
      descripcion: 'Nivel de satisfacción del empleado con la capacitación recibida',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Satisfacción insuficiente' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Satisfacción aceptable' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Satisfacción excelente' }
      ]
    },
    {
      nombre: 'Aprendizaje',
      descripcion: 'Conocimiento adquirido y comprensión de los contenidos',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Aprendizaje limitado' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Aprendizaje satisfactorio' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Aprendizaje sobresaliente' }
      ]
    },
    {
      nombre: 'Desempeño',
      descripcion: 'Mejora en el rendimiento laboral post-capacitación',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Mejora mínima' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Mejora notable' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Mejora significativa' }
      ]
    },
    {
      nombre: 'Clima Laboral',
      descripcion: 'Impacto en el ambiente y relaciones laborales',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Impacto negativo o nulo' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Impacto positivo moderado' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Impacto muy positivo' }
      ]
    },
    {
      nombre: 'Disciplina',
      descripcion: 'Cumplimiento de normas y procedimientos organizacionales',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Cumplimiento deficiente' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Cumplimiento adecuado' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Cumplimiento excepcional' }
      ]
    },
    {
      nombre: 'Impacto Económico',
      descripcion: 'Beneficio económico generado por la capacitación',
      conjuntos: [
        { nombre: 'Bajo', rango: '0-40%', descripcion: 'Beneficio limitado' },
        { nombre: 'Medio', rango: '20-80%', descripcion: 'Beneficio considerable' },
        { nombre: 'Alto', rango: '60-100%', descripcion: 'Beneficio excepcional' }
      ]
    }
  ];

  // Proceso del sistema híbrido
  hibridoProcess = [
    {
      paso: 1,
      titulo: 'Captura de Datos',
      descripcion: 'El usuario ingresa valores para las 6 variables de entrada en un rango de 0-100%',
      tecnologia: 'Angular Forms + Validación'
    },
    {
      paso: 2,
      titulo: 'Fuzzificación',
      descripcion: 'Los valores numéricos se convierten en grados de pertenencia para cada conjunto difuso',
      tecnologia: 'Lógica Difusa + Funciones Triangulares'
    },
    {
      paso: 3,
      titulo: 'Evaluación de Reglas',
      descripcion: 'El motor de inferencia evalúa las reglas expertas almacenadas en Prolog',
      tecnologia: 'Sistema Experto + Prolog'
    },
    {
      paso: 4,
      titulo: 'Defuzzificación',
      descripcion: 'Los resultados difusos se convierten en valores numéricos finales',
      tecnologia: 'Método del Centroide'
    },
    {
      paso: 5,
      titulo: 'Visualización',
      descripcion: 'Se presentan los resultados con gráficos interactivos y métricas',
      tecnologia: 'Chart.js + Angular Material'
    }
  ];
}