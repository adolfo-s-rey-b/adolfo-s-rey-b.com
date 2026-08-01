---
title: "Fundamentos de Teoría de Juegos"
description: "Definición formal, equilibrio de Nash, estrategias dominantes."
order: 1
---

## Definición formal de un juego

Un juego en forma normal se define como la tupla:

$$
G = \left(I, \{S_i\}_{i \in I}, \{u_i\}_{i \in I}\right)
$$

Donde $I$ es el conjunto finito de jugadores, $S_i$ es el conjunto de estrategias puras disponibles para el jugador $i$, y $u_i: S \to \mathbb{R}$ es la función de utilidad (payoff) del jugador $i$ sobre el espacio de perfiles de estrategias $S = \prod_{i \in I} S_i$.

## Equilibrio de Nash

Un perfil de estrategias $s^* = (s_1^*, \ldots, s_n^*)$ es un **Equilibrio de Nash** si para todo jugador $i \in I$:

$$
u_i(s_i^*, s_{-i}^*) \geq u_i(s_i, s_{-i}^*) \quad \forall s_i \in S_i
$$

Es decir, ningún jugador puede mejorar su utilidad desviándose unilateralmente, dado que los demás mantienen sus estrategias de equilibrio.

## Estrategias mixtas y el teorema de Nash

Una estrategia mixta para el jugador $i$ es una distribución de probabilidad $\sigma_i \in \Delta(S_i)$ sobre sus estrategias puras. El **Teorema de Nash (1950)** garantiza que todo juego finito en forma normal tiene al menos un equilibrio en estrategias mixtas.

La utilidad esperada del jugador $i$ bajo un perfil de estrategias mixtas $\sigma$ es:

$$
U_i(\sigma) = \sum_{s \in S} \left(\prod_{j \in I} \sigma_j(s_j)\right) u_i(s)
$$

## Juegos dinámicos e inducción hacia atrás

En juegos extensivos con **información perfecta**, el Equilibrio Perfecto en Subjuegos (EPS) se obtiene por inducción hacia atrás: se resuelve desde los nodos terminales hacia el nodo raíz, eligiendo en cada subárbol la acción que maximiza la utilidad del jugador que mueve en ese nodo.

El EPS refina el concepto de Equilibrio de Nash eliminando amenazas no creíbles fuera del camino de equilibrio.

## Información asimétrica y señalización

En el modelo de señalización de **Spence (1973)**, un agente de tipo $\theta \in \{\theta_L, \theta_H\}$ elige un nivel de educación $e \geq 0$ a un costo $c(e, \theta)$ con $c_\theta < 0$ (el tipo alto tiene menor costo de señalizar). En un equilibrio separador, la educación $e^*$ satisface las restricciones de incentivos:

$$
u(\theta_H, e^*) - c(e^*, \theta_H) \geq u(\theta_H, e_L) - c(e_L, \theta_H)
$$

$$
u(\theta_L, e^*) - c(e^*, \theta_L) \leq u(\theta_L, e_L) - c(e_L, \theta_L)
$$

Donde $e_L = 0$ es el nivel de educación del tipo bajo en el equilibrio separador.
