---
title: "Machine Learning aplicado a la focalización en Salud Pública"
date: "2026-02-28"
category: "Data Science"
excerpt: "Reflexiones sobre el uso de algoritmos de aprendizaje automático para identificar poblaciones vulnerables y optimizar el gasto en salud pública, basadas en el trabajo con microrredes hospitalarias de El Salvador."
---

## Contexto

El trabajo con el Banco Mundial en El Salvador nos permitió explorar cómo los algoritmos de clasificación pueden mejorar la focalización del gasto en salud. El problema central era identificar pacientes con alta probabilidad de multimorbilidad —la presencia simultánea de dos o más enfermedades crónicas— antes de que llegaran a una fase costosa de atención.

## Metodología

Comparamos cuatro algoritmos sobre una muestra de 45,000 registros de consulta de tres microrredes hospitalarias: Regresión Logística (línea de base), Random Forest, Gradient Boosting y una Red Neuronal de dos capas. La métrica principal fue el F1-score sobre la clase positiva, dado el desbalance entre clases (12% de casos positivos).

## Resultados

El modelo de Gradient Boosting alcanzó el mejor desempeño global. El F1-score se define como:

$$
F_1 = 2 \cdot \frac{\text{Precisión} \times \text{Recall}}{\text{Precisión} + \text{Recall}}
$$

Con un $F_1 = 0.84$ en el conjunto de prueba, el modelo superó consistentemente el diagnóstico clínico convencional, que mostraba un $F_1 \approx 0.61$ según los registros históricos del sistema.

## Interpretabilidad y política pública

La adopción de modelos de ML en política pública requiere interpretabilidad. Utilizamos valores SHAP (Shapley Additive Explanations) para identificar las variables de mayor influencia: edad, número de consultas en los últimos 12 meses, y diagnóstico previo de hipertensión o diabetes.

$$
\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N|-|S|-1)!}{|N|!} \left[ v(S \cup \{i\}) - v(S) \right]
$$

## Implicaciones de política

La focalización basada en ML reduciría el costo por caso identificado en un 23%, permitiendo reasignar recursos hacia atención preventiva. La recomendación principal fue integrar el modelo como herramienta de apoyo a los equipos de medicina familiar, no como sustituto del juicio clínico.
