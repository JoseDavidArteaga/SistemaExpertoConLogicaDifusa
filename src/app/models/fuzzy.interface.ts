export interface InputData {
  satisfaccion: number;
  aprendizaje: number;
  desempeno: number;
  clima: number;
  disciplina: number;
  economicos: number;
}

export interface FuzzyResult {
  impacto_individual: number;
  impacto_organizacional: number;
  impacto_total: number;
}

export interface MembershipFunction {
  bajo: number;
  medio: number;
  alto: number;
}

export interface FuzzyVisualization {
  variable: string;
  value: number;
  membership: MembershipFunction;
}