---
title: "Teoría del Consumidor"
description: "Maximización de utilidad, restricción presupuestaria, condiciones KKT."
order: 1
---

## Teoría del consumidor

El problema del consumidor es maximizar la utilidad sujeta a la restricción presupuestaria:

$$
\max_{x_1, x_2} \; u(x_1, x_2) \quad \text{s.t.} \quad p_1 x_1 + p_2 x_2 = m
$$

Las condiciones de primer orden (KKT) implican la igualdad entre la tasa marginal de sustitución y el cociente de precios:

$$
\frac{MU_1}{MU_2} = \frac{p_1}{p_2} \quad \Longleftrightarrow \quad \frac{MU_1}{p_1} = \frac{MU_2}{p_2} = \lambda
$$

Donde $\lambda$ es el multiplicador de Lagrange, interpretado como la utilidad marginal del ingreso.

## Teoría de la firma

La firma minimiza costos para producir $q$ unidades dado el vector de precios de insumos $(w, r)$:

$$
\min_{K, L} \; wL + rK \quad \text{s.t.} \quad f(K, L) \geq q
$$

La condición de eficiencia técnica en la elección de insumos es:

$$
\frac{PM_L}{w} = \frac{PM_K}{r} \quad \Longleftrightarrow \quad \frac{PM_L}{PM_K} = \frac{w}{r}
$$

## Equilibrio general y óptimo de Pareto

En una economía de intercambio puro con dos bienes y dos agentes, el equilibrio walrasiano es una asignación $(x^*, p^*)$ tal que los mercados se vacían. El **Primer Teorema del Bienestar** establece que todo equilibrio competitivo es un Óptimo de Pareto cuando los mercados son completos y no existen externalidades.

El **Segundo Teorema del Bienestar** garantiza que cualquier Óptimo de Pareto puede descentralizarse como un equilibrio competitivo con transferencias de suma alzada adecuadas.

## Bienes públicos y fallos de mercado

Un bien público se caracteriza por la **no-rivalidad** (el consumo de un agente no reduce el disponible para otros) y la **no-exclusión** (no es posible excluir a nadie de su consumo). La regla de Samuelson para la provisión óptima del bien público establece:

$$
\sum_{i=1}^{n} MRS_i^{xy} = MRT^{xy}
$$

Es decir, la suma de las tasas marginales de sustitución entre el bien público $y$ y el bien privado $x$ debe igualarse a la tasa marginal de transformación en la producción.
