import numpy as np
from pyswip import Prolog

# Iniciar Prolog y cargar reglas
prolog = Prolog()
prolog.consult("reglas_capacitacion.pl")

class VariableDifusa:
    def __init__(self, nombre):
        self.nombre = nombre
        # Universo de discurso 0-10 [cite: 139]
        self.x = np.linspace(0, 10, 100)
    
    # Definición de funciones de pertenencia según Figura 1 
    def membresia(self, valor):
        # Bajo: Trapezoide bajando de 1 a 5
        mu_bajo = np.interp(valor, [0, 1, 5], [1, 1, 0])
        
        # Medio: Triángulo centrado en 5
        mu_medio = np.interp(valor, [2.5, 5, 7.5], [0, 1, 0])
        
        # Alto: Trapezoide subiendo de 5 a 9
        mu_alto = np.interp(valor, [5, 9, 10], [0, 1, 1])
        
        return {'bajo': mu_bajo, 'medio': mu_medio, 'alto': mu_alto}

def inferencia_mamdani_hibrida(entradas_dict):
    """
    Realiza la inferencia usando Prolog para las reglas y Python para la matemática difusa.
    """
    
    # 1. FUSIFICACIÓN: Calcular grados de pertenencia para cada entrada
    grados = {}
    for nombre_var, valor_crisp in entradas_dict.items():
        var_obj = VariableDifusa(nombre_var)
        grados[nombre_var] = var_obj.membresia(valor_crisp)

    # Definimos las etiquetas lingüísticas
    etiquetas = ['bajo', 'medio', 'alto']
    
    # Preparamos acumuladores para la agregación (Max)
    salida_agregada = {'bajo': 0.0, 'medio': 0.0, 'alto': 0.0}
    
    # --- SUBSISTEMA 1: IMPACTO INDIVIDUAL ---
    imp_ind_fuzzy = {'bajo': 0.0, 'medio': 0.0, 'alto': 0.0}
    
    for s in etiquetas: # Satisfacción
        for a in etiquetas: # Aprendizaje
            for d in etiquetas: # Desempeño
                
                # Calcular el "firing strength" (Mínimo / AND)
                alfa = min(grados['satisfaccion'][s], 
                           grados['aprendizaje'][a], 
                           grados['desempeno'][d])
                
                if alfa > 0:
                    # CONSULTA A PROLOG: ¿Cuál es el resultado según los expertos?
                    query = list(prolog.query(f"impacto_ind({s}, {a}, {d}, R)"))
                    if query:
                        resultado_linguistico = query[0]['R']
                        # Acumulación (Máximo / OR)
                        imp_ind_fuzzy[resultado_linguistico] = max(imp_ind_fuzzy[resultado_linguistico], alfa)

    # Defusificar Impacto Individual (necesario para entrar a la fase 2)
    valor_ind = defusificar(imp_ind_fuzzy)
    
    # --- SUBSISTEMA 2: IMPACTO ORGANIZACIONAL ---
    imp_org_fuzzy = {'bajo': 0.0, 'medio': 0.0, 'alto': 0.0}
    
    for c in etiquetas: # Clima
        for di in etiquetas: # Disciplina
            for e in etiquetas: # Economicos
                alfa = min(grados['clima'][c], 
                           grados['disciplina'][di], 
                           grados['economicos'][e])
                
                if alfa > 0:
                    query = list(prolog.query(f"impacto_org({c}, {di}, {e}, R)"))
                    if query:
                        res = query[0]['R']
                        imp_org_fuzzy[res] = max(imp_org_fuzzy[res], alfa)
                        
    valor_org = defusificar(imp_org_fuzzy)

    # --- SUBSISTEMA 3: IMPACTO TOTAL ---
    # Ahora las entradas son los resultados defusificados de los pasos anteriores
    # Se vuelven a fusificar
    var_temp = VariableDifusa("temp")
    g_ind = var_temp.membresia(valor_ind)
    g_org = var_temp.membresia(valor_org)
    
    imp_total_fuzzy = {'bajo': 0.0, 'medio': 0.0, 'alto': 0.0}
    
    for i_ind in etiquetas:
        for i_org in etiquetas:
            alfa = min(g_ind[i_ind], g_org[i_org])
            
            if alfa > 0:
                query = list(prolog.query(f"impacto_total({i_ind}, {i_org}, R)"))
                if query:
                    res = query[0]['R']
                    imp_total_fuzzy[res] = max(imp_total_fuzzy[res], alfa)
    
    valor_final = defusificar(imp_total_fuzzy)


    # --- DEBUGGING OUTPUT ---
    print("\n--- DEBUG ---")
    print("Imp_Org_Fuzzy dentro de la función =", imp_org_fuzzy)
    print("Fuzzy Individual =", imp_ind_fuzzy)
    print("Fuzzy Total =", imp_total_fuzzy)
    print("------------------\n")
    
    return valor_ind, valor_org, valor_final

def defusificar(fuzzy_result):
    """Método del Centroide (Center of Gravity) """
    x = np.linspace(0, 10, 100)
    num = 0.0
    den = 0.0
    
    # Reconstruir la forma geométrica final cortada por los alfas
    # Usamos las mismas formas de la VariableDifusa para la salida
    vd = VariableDifusa("salida")
    
    for i in range(len(x)):
        val_x = x[i]
        memb = vd.membresia(val_x)
        
        # Agregación de conjuntos cortados
        mu_final = max(
            min(memb['bajo'], fuzzy_result['bajo']),
            min(memb['medio'], fuzzy_result['medio']),
            min(memb['alto'], fuzzy_result['alto'])
        )
        
        num += val_x * mu_final
        den += mu_final
        
    if den == 0: return 0
    return num / den

# --- EJECUCIÓN DEL CASO DE PRUEBA ---
datos_entrada = {
    'satisfaccion': 9.0, 
    'aprendizaje': 8.5, 
    'desempeno': 9.0,
    'clima': 7.0, 
    'disciplina': 8.0, 
    'economicos': 6.5
}

print("Calculando impacto de la capacitación con motor Híbrido Python-Prolog...")
ind, org, tot = inferencia_mamdani_hibrida(datos_entrada)

print(f"\n--- RESULTADOS ---")
print(f"Impacto Individual:     {ind:.2f} / 10")
print(f"Impacto Organizacional: {org:.2f} / 10")
print(f"IMPACTO TOTAL:          {tot:.2f} / 10")

grados_clima = VariableDifusa('clima').membresia(0.5)
print("grados clima:", grados_clima)
grados_disc = VariableDifusa('disciplina').membresia(9.9)
print("grados disciplina:", grados_disc)
grados_econ = VariableDifusa('economicos').membresia(9.9)
print("grados economicos:", grados_econ)




print("\n====================")
print("  TEST REGLAS: impacto_org")
print("====================\n")

etiquetas = ["bajo", "medio", "alto"]

# ---- PRUEBA REGLA: impacto_org(_, _, bajo, bajo)
print(">>> Probando regla: impacto_org(_, _, bajo, bajo)\n")
for c in etiquetas:
    for d in etiquetas:
        r = list(prolog.query(f"impacto_org({c}, {d}, bajo, R)"))
        print(f"Clima={c}, Disciplina={d}, Economico=bajo → {r}")
print("\n")

# ---- PRUEBA REGLA: impacto_org(bajo, _, _, bajo)
print(">>> Probando regla: impacto_org(bajo, _, _, bajo)\n")
for d in etiquetas:
    for e in etiquetas:
        r = list(prolog.query(f"impacto_org(bajo, {d}, {e}, R)"))
        print(f"Clima=bajo, Disciplina={d}, Economico={e} → {r}")
print("\n")


print("\n====================")
print("  TEST REGLAS: impacto_ind")
print("====================\n")

for s in etiquetas:
    for a in etiquetas:
        for d in etiquetas:
            r = list(prolog.query(f"impacto_ind({s}, {a}, {d}, R)"))
            if r:
                print(f"s={s}, a={a}, d={d} → {r}")


print("\n====================")
print("  TEST REGLAS: impacto_total")
print("====================\n")

for i in etiquetas:
    for o in etiquetas:
        r = list(prolog.query(f"impacto_total({i}, {o}, R)"))
        print(f"ImpactoInd={i}, ImpactoOrg={o} → {r}")

print("\n--- FIN DE PRUEBAS ---\n")