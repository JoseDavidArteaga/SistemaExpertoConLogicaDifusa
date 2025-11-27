import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { InputData, FuzzyResult } from '../../models/fuzzy.interface';

@Component({
  selector: 'app-fuzzy-process',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './fuzzy-process.component.html',
  styleUrl: './fuzzy-process.component.scss'
})
export class FuzzyProcessComponent {
  @Input() inputData: InputData | null = null;
  @Input() isLoading: boolean = false;
  @Input() results: FuzzyResult | null = null;

  getProcessSteps() {
    return [
      { name: 'Fuzzificación', description: 'Convirtiendo valores de entrada a conjuntos difusos', completed: true },
      { name: 'Aplicación de Reglas', description: 'Aplicando reglas del sistema experto', completed: this.inputData !== null },
      { name: 'Agregación', description: 'Combinando resultados de todas las reglas', completed: this.inputData !== null && !this.isLoading },
      { name: 'Defuzzificación', description: 'Convirtiendo resultado difuso a valor numérico', completed: this.results !== null }
    ];
  }
}