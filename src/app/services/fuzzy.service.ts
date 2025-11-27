import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InputData, FuzzyResult, MembershipFunction } from '../models/fuzzy.interface';

@Injectable({
  providedIn: 'root'
})
export class FuzzyService {
  private apiUrl = 'http://localhost:8000/api'; // URL del backend Python

  constructor(private http: HttpClient) { }

  // Simular la evaluación difusa (para desarrollo)
  evaluateFuzzyLogic(inputData: InputData): Observable<FuzzyResult> {
    // TODO: Reemplazar con llamada real al backend Python
    // return this.http.post<FuzzyResult>(`${this.apiUrl}/evaluate`, inputData);
    
    // Simulación para desarrollo
    const mockResult: FuzzyResult = {
      impacto_individual: this.calculateMockValue(inputData.satisfaccion, inputData.aprendizaje, inputData.desempeno),
      impacto_organizacional: this.calculateMockValue(inputData.clima, inputData.disciplina, inputData.economicos),
      impacto_total: 0
    };
    
    mockResult.impacto_total = (mockResult.impacto_individual + mockResult.impacto_organizacional) / 2;
    
    return of(mockResult);
  }

  // Calcular función de pertenencia para una variable
  calculateMembership(value: number): MembershipFunction {
    // Implementación basada en el sistema Python original
    const mu_bajo = Math.max(0, Math.min(1, (5 - value) / 4));
    const mu_medio = Math.max(0, Math.min(1, value <= 5 ? (value - 2.5) / 2.5 : (7.5 - value) / 2.5));
    const mu_alto = Math.max(0, Math.min(1, (value - 5) / 4));

    return {
      bajo: mu_bajo,
      medio: mu_medio,
      alto: mu_alto
    };
  }

  private calculateMockValue(val1: number, val2: number, val3: number): number {
    return Math.min(10, Math.max(0, (val1 + val2 + val3) / 3));
  }
}