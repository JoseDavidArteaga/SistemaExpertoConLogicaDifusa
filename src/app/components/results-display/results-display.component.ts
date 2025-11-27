import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FuzzyResult } from '../../models/fuzzy.interface';

@Component({
  selector: 'app-results-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './results-display.component.html',
  styleUrl: './results-display.component.scss'
})
export class ResultsDisplayComponent implements OnChanges {
  @Input() results: FuzzyResult | null = null;
  
  impactoIndividualPercent = 0;
  impactoOrganizacionalPercent = 0;
  impactoTotalPercent = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.impactoIndividualPercent = (this.results.impacto_individual / 10) * 100;
      this.impactoOrganizacionalPercent = (this.results.impacto_organizacional / 10) * 100;
      this.impactoTotalPercent = (this.results.impacto_total / 10) * 100;
    }
  }

  getImpactLevel(value: number): string {
    if (value < 3.5) return 'Bajo';
    if (value < 7) return 'Medio';
    return 'Alto';
  }

  getImpactColor(value: number): string {
    if (value < 3.5) return 'warn';
    if (value < 7) return 'accent';
    return 'primary';
  }
}
