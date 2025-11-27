import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputFormComponent } from '../../components/input-form/input-form.component';
import { ResultsDisplayComponent } from '../../components/results-display/results-display.component';
import { MembershipChartsComponent } from '../../components/membership-charts/membership-charts.component';
import { FuzzyService } from '../../services/fuzzy.service';
import { InputData, FuzzyResult } from '../../models/fuzzy.interface';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    InputFormComponent, 
    ResultsDisplayComponent,
    MembershipChartsComponent
  ],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss'
})
export class EvaluationComponent {
  results: FuzzyResult | null = null;
  inputData: InputData | null = null;
  isLoading = false;

  constructor(private fuzzyService: FuzzyService) {}

  onFormSubmit(inputData: InputData) {
    this.inputData = inputData;
    this.isLoading = true;
    // Simular tiempo de procesamiento con un efecto más realista
    setTimeout(() => {
      this.fuzzyService.evaluateFuzzyLogic(inputData).subscribe({
        next: (result) => {
          this.results = result;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error evaluating fuzzy logic:', error);
          this.isLoading = false;
        }
      });
    }, 1500);
  }
}