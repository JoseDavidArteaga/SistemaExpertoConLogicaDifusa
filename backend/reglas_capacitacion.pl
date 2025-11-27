% reglas_capacitacion.pl

% --- REGLAS NIVEL 1: IMPACTO INDIVIDUAL ---
% Basado en Tabla 4 [cite: 228]
% Estructura: impacto_ind(Satisfaccion, Aprendizaje, Desempeno, Resultado).

% Casos de EXITO (Alto Impacto)
impacto_ind(alto, alto, alto, alto).
impacto_ind(medio, alto, alto, alto).
impacto_ind(alto, medio, alto, medio).   % Ajuste según tabla
impacto_ind(alto, poco, alto, alto).     % Caso curioso en la tabla, fila 7

% Casos MEDIOS
impacto_ind(bajo, alto, alto, medio).
impacto_ind(medio, medio, alto, medio).
impacto_ind(bajo, medio, alto, medio).
impacto_ind(medio, poco, alto, medio).

% Casos BAJOS / SIN IMPACTO
impacto_ind(bajo, poco, alto, bajo).     % "Sin impacto" en el paper

% Reglas por defecto (Completitud) para combinaciones no explícitas en el paper
impacto_ind(_, _, bajo, bajo).           % Si el desempeño es bajo, el impacto es bajo
impacto_ind(_, bajo, medio, bajo).
impacto_ind(X, Y, Z, medio) :- \+ impacto_ind(X, Y, Z, alto), \+ impacto_ind(X, Y, Z, bajo).


% --- REGLAS NIVEL 1: IMPACTO ORGANIZACIONAL ---
% Basado en la lógica descrita en el texto y Figura 2 [cite: 181, 211]
% Estructura: impacto_org(Clima, Disciplina, Economicos, Resultado).

impacto_org(alto, alto, alto, alto).
impacto_org(medio, alto, alto, alto).
impacto_org(alto, medio, alto, alto).
impacto_org(medio, medio, medio, medio).
impacto_org(_, _, bajo, bajo).           % El peso económico es crítico
impacto_org(bajo, _, _, bajo).           % Clima desfavorable afecta todo
impacto_org(X, Y, Z, medio) :- \+ impacto_org(X, Y, Z, alto), \+ impacto_org(X, Y, Z, bajo).


% --- REGLAS NIVEL 2: IMPACTO TOTAL ---
% Integración final [cite: 183]
% Estructura: impacto_total(ImpactoInd, ImpactoOrg, ResultadoFinal).

impacto_total(alto, alto, alto).
impacto_total(medio, alto, alto).        % Tabla 3, Fila 2
impacto_total(alto, medio, medio).
impacto_total(medio, medio, medio).
impacto_total(_, bajo, bajo).
impacto_total(bajo, _, bajo).