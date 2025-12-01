import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { InputData, FuzzyResult } from '../../models/fuzzy.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-membership-charts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatButtonModule, MatIconModule],
  templateUrl: './membership-charts.component.html',
  styleUrl: './membership-charts.component.scss'
})
export class MembershipChartsComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() inputData: InputData | null = null;
  @Input() result: FuzzyResult | null = null;

  @ViewChild('satisfactionCanvas') satisfactionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('learningCanvas') learningCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('performanceCanvas') performanceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('climateCanvas') climateCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('disciplineCanvas') disciplineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('economicCanvas') economicCanvas!: ElementRef<HTMLCanvasElement>;

  private charts: { [key: string]: Chart } = {};

  ngAfterViewInit() {
    if (this.inputData) {
      this.createCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputData'] && this.inputData) {
      // Esperar a que las vistas estén inicializadas
      setTimeout(() => {
        this.createCharts();
      }, 100);
    }
  }

  private createCharts() {
    this.destroyCharts();

    if (!this.inputData) return;

    const variables = [
      { key: 'satisfaccion', canvas: this.satisfactionCanvas, label: 'Satisfacción', value: this.inputData.satisfaccion },
      { key: 'aprendizaje', canvas: this.learningCanvas, label: 'Aprendizaje', value: this.inputData.aprendizaje },
      { key: 'desempeno', canvas: this.performanceCanvas, label: 'Desempeño', value: this.inputData.desempeno },
      { key: 'clima', canvas: this.climateCanvas, label: 'Clima Laboral', value: this.inputData.clima },
      { key: 'disciplina', canvas: this.disciplineCanvas, label: 'Disciplina', value: this.inputData.disciplina },
      { key: 'economicos', canvas: this.economicCanvas, label: 'Impacto Económico', value: this.inputData.economicos }
    ];

    variables.forEach(variable => {
      if (variable.canvas?.nativeElement) {
        this.charts[variable.key] = this.createDefuzzificationChart(
          variable.canvas.nativeElement,
          variable.label,
          variable.value
        );
      }
    });
  }

  // Método público para obtener valor defuzzificado
  getDefuzzifiedValue(variable: string): number {
    if (!this.inputData) return 0;

    let inputValue: number;
    switch (variable) {
      case 'satisfaccion': inputValue = this.inputData.satisfaccion; break;
      case 'aprendizaje': inputValue = this.inputData.aprendizaje; break;
      case 'desempeno': inputValue = this.inputData.desempeno; break;
      case 'clima': inputValue = this.inputData.clima; break;
      case 'disciplina': inputValue = this.inputData.disciplina; break;
      case 'economicos': inputValue = this.inputData.economicos; break;
      default: return 0;
    }

    return this.calculateCentroid(inputValue);
  }

  // Calcular grados de pertenencia para un valor
  private getMembershipDegrees(inputValue: number): { bajo: number, medio: number, alto: number } {
    return {
      bajo: this.lowMembership(inputValue),
      medio: this.mediumMembership(inputValue),
      alto: this.highMembership(inputValue)
    };
  }

  // Calcular centroide usando método del centro de gravedad
  private calculateCentroid(inputValue: number): number {
    const degrees = this.getMembershipDegrees(inputValue);

    // Simular evaluación de reglas y crear figura resultante
    let numerator = 0;
    let denominator = 0;

    // Rango de valores de salida (0-10)
    for (let x = 0; x <= 10; x += 0.1) {
      // Combinar los conjuntos según las reglas evaluadas
      let outputMembership = 0;

      // Regla 1: Si es bajo, la salida tiende a ser baja
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.bajo, this.lowMembership(x)));

      // Regla 2: Si es medio, la salida tiende a ser media
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.medio, this.mediumMembership(x)));

      // Regla 3: Si es alto, la salida tiende a ser alta
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.alto, this.highMembership(x)));

      numerator += x * outputMembership;
      denominator += outputMembership;
    }

    return denominator > 0 ? numerator / denominator : inputValue;
  }

  private createDefuzzificationChart(canvas: HTMLCanvasElement, label: string, inputValue: number): Chart {
    const ctx = canvas.getContext('2d')!;

    // Generar datos para las funciones de pertenencia y la figura resultante (0-10)
    const xValues = Array.from({ length: 101 }, (_, i) => i / 10);
    const degrees = this.getMembershipDegrees(inputValue);

    // Funciones base (en gris claro para referencia) - escala 0-10
    const lowBase = xValues.map(x => this.lowMembership(x));
    const mediumBase = xValues.map(x => this.mediumMembership(x));
    const highBase = xValues.map(x => this.highMembership(x));

    // Figura resultante combinada (defuzzificación) - escala 0-10
    const resultShape = xValues.map(x => {
      let outputMembership = 0;

      // Combinar según las reglas evaluadas (usando operador MAX)
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.bajo, this.lowMembership(x)));
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.medio, this.mediumMembership(x)));
      outputMembership = Math.max(outputMembership,
        Math.min(degrees.alto, this.highMembership(x)));

      return outputMembership;
    });

    // Calcular centroide
    const centroid = this.calculateCentroid(inputValue);

    // Crear línea vertical del centroide como dos puntos conectados

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [
          // Funciones base (referencia)
          {
            label: 'Bajo (base)',
            data: lowBase,
            borderColor: 'rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [5, 5]
          },
          {
            label: 'Medio (base)',
            data: mediumBase,
            borderColor: 'rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [5, 5]
          },
          {
            label: 'Alto (base)',
            data: highBase,
            borderColor: 'rgba(16, 185, 129, 0.3)',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 1,
            borderDash: [5, 5]
          },
          // Figura resultante (defuzzificación)
          {
            label: 'Resultado Combinado',
            data: resultShape,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            fill: true,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 3
          },
          // Línea del centroide (línea vertical)
          {
            label: `Centroide: ${centroid.toFixed(2)}`,
            data: [
              { x: centroid, y: 0 },
              { x: centroid, y: 1 }
            ],
            borderColor: '#DC2626',
            backgroundColor: '#DC2626',
            borderWidth: 4,
            pointRadius: 0,
            showLine: true,
            fill: false,
            tension: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Defuzzificación - ${label} (Entrada: ${inputValue}/10)`,
            font: {
              family: 'Poppins',
              size: 14,
              weight: 600
            },
            color: '#111827'
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: 'Inter',
                size: 11
              },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'line',
              filter: function (legendItem, chartData) {
                // Mostrar solo los datasets más importantes
                return !!(legendItem.text && (
                  legendItem.text.includes('Resultado') ||
                  legendItem.text.includes('Centroide')
                ));
              }
            }
          },
          tooltip: {
            callbacks: {
              title: function (context) {
                return `Valor: ${context[0].label}/10`;
              },
              label: function (context) {
                if (context.dataset.label?.includes('Centroide')) {
                  return `${context.dataset.label} - Centro de Gravedad`;
                }
                return `${context.dataset.label}: ${context.parsed.y?.toFixed(3) || 0}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 10,
            title: {
              display: true,
              text: 'Valor de Salida (0-10)',
              font: {
                family: 'Inter',
                size: 12,
                weight: 500
              },
              color: '#6B7280'
            },
            grid: {
              color: '#E5E7EB',
              lineWidth: 1
            },
            ticks: {
              color: '#6B7280',
              font: {
                family: 'Inter',
                size: 10
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grado de Pertenencia',
              font: {
                family: 'Inter',
                size: 12,
                weight: 500
              },
              color: '#6B7280'
            },
            min: 0,
            max: 1,
            grid: {
              color: '#E5E7EB',
              lineWidth: 1
            },
            ticks: {
              color: '#6B7280',
              font: {
                family: 'Inter',
                size: 10
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    return new Chart(ctx, config);
  }

  private triangularMembership(x: number, a: number, b: number, c: number): number {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);
    return (c - x) / (c - b);
  }

  private trapezoidalMembership(x: number, a: number, b: number, c: number, d: number): number {
    if (x < a || x > d) return 0;
    if (x >= b && x <= c) return 1;
    if (x >= a && x < b) return (x - a) / (b - a);
    if (x > c && x <= d) return (d - x) / (d - c);
    return 0;
  }

  // Funciones de pertenencia específicas según el paper
  private lowMembership(x: number): number {
    // BAJO: Trapezoidal descendente
    // μ(x) = 1 para x ∈ [0, 1]
    // μ(x) = (5-x)/4 para x ∈ [1, 5]
    // μ(x) = 0 para x > 5
    if (x < 0 || x > 5) return 0;
    if (x >= 0 && x <= 1) return 1;
    if (x > 1 && x <= 5) return (5 - x) / 4;
    return 0;
  }

  private mediumMembership(x: number): number {
    // MEDIO: Triangular
    // μ(x) = 0 para x < 2.5
    // μ(x) = (x-2.5)/2.5 para x ∈ [2.5, 5]
    // μ(x) = (7.5-x)/2.5 para x ∈ [5, 7.5]
    // μ(x) = 0 para x > 7.5
    if (x < 2.5 || x > 7.5) return 0;
    if (x >= 2.5 && x <= 5) return (x - 2.5) / 2.5;
    if (x > 5 && x <= 7.5) return (7.5 - x) / 2.5;
    return 0;
  }

  private highMembership(x: number): number {
    // ALTO: Trapezoidal ascendente
    // μ(x) = 0 para x < 5
    // μ(x) = (x-5)/4 para x ∈ [5, 9]
    // μ(x) = 1 para x ∈ [9, 10]
    if (x < 5 || x > 10) return 0;
    if (x >= 5 && x < 9) return (x - 5) / 4;
    if (x >= 9 && x <= 10) return 1;
    return 0;
  }

  private destroyCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  ngOnDestroy() {
    this.destroyCharts();
  }
}
