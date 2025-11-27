# El archivo sistemaExperto.py es un archivo de EJEMPLO que no tiene peso en el proyecto-
# Es un sistema experto basado en lógica difusa
# que utiliza la biblioteca scikit-fuzzy para implementar un sistema de control difuso.
# Este sistema controla la velocidad de un ventilador basado en la temperatura ambiente.
# Este archivo no está relacionado con el sistema difuso basado en Prolog del archivo sistemaDifuso.py
# Solo sirve como referencia de un sistema experto difuso simple.

import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# Definir variables difusas
temperatura = ctrl.Antecedent(np.arange(0, 41, 1), 'temperatura')
velocidad = ctrl.Consequent(np.arange(0, 101, 1), 'velocidad')

# Funciones de pertenencia
temperatura['baja'] = fuzz.trimf(temperatura.universe, [0, 0, 20])
temperatura['media'] = fuzz.trimf(temperatura.universe, [10, 20, 30])
temperatura['alta'] = fuzz.trimf(temperatura.universe, [20, 40, 40])

velocidad['lenta'] = fuzz.trimf(velocidad.universe, [0, 0, 50])
velocidad['media'] = fuzz.trimf(velocidad.universe, [25, 50, 75])
velocidad['rapida'] = fuzz.trimf(velocidad.universe, [50, 100, 100])

# Reglas
regla1 = ctrl.Rule(temperatura['baja'], velocidad['lenta'])
regla2 = ctrl.Rule(temperatura['media'], velocidad['media'])
regla3 = ctrl.Rule(temperatura['alta'], velocidad['rapida'])

# Controlador
controlador = ctrl.ControlSystem([regla1, regla2, regla3])
simulador = ctrl.ControlSystemSimulation(controlador)

# Probar el sistema
entrada_temp = 27
simulador.input['temperatura'] = entrada_temp
simulador.compute()

print(f"Temperatura: {entrada_temp} °C")
print(f"Velocidad del ventilador: {simulador.output['velocidad']:.2f}%")
