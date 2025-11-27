import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/evaluacion',
    pathMatch: 'full'
  },
  {
    path: 'evaluacion',
    loadComponent: () => import('./pages/evaluation/evaluation.component').then(m => m.EvaluationComponent)
  },
  {
    path: 'informacion',
    loadComponent: () => import('./pages/information/information.component').then(m => m.InformationComponent)
  },
  {
    path: '**',
    redirectTo: '/evaluacion'
  }
];
