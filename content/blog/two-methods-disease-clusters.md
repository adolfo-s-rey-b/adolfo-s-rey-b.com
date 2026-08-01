---
title: "Estimating disease clusters twice, on purpose"
date: "2026-06-05"
type: "commentary"
lang: "en"
summary: "Notes on a design choice from the El Salvador multimorbidity study: running two independent clustering methods was not redundancy, it was the only available validity check."
published: true
---

Between 2021 and 2022 I worked on a study of chronic-disease multimorbidity across three hospital micronetworks in El Salvador — Apastepeque, La Palma and Jiquilisco — for the Ministry of Health, under a World Bank–funded non-communicable diseases project. The goal was practical: help decide where prevention spending should go.

One design choice from that project has stayed with me, and it generalizes well beyond health economics.

## The problem with clustering

Before anything could be estimated, 12,618 ICD-10 subcategories had to be collapsed into 123 chronic condition groups. That step is already a modelling decision dressed up as data cleaning, and it constrains everything downstream.

Then came the actual question: which conditions travel together in the same patient? This is a clustering problem, and clustering has an uncomfortable property. It always returns an answer. Ask K-means for six clusters and you get six clusters, whether or not six groups exist in any meaningful sense. There is no residual to inspect, no coefficient whose standard error tells you the structure is not there. The output looks equally confident when it is describing real comorbidity patterns and when it is describing noise.

For a paper that might be an academic annoyance. For a document that will inform how a health ministry targets spending, it is a serious problem: someone will act on those clusters.

## Two methods instead of one

So we estimated the clusters twice, using methods that fail differently.

The first was a set of structural equation models for the conditional probabilities of co-occurrence — an approach that starts from an explicit structure about how conditions relate and asks whether the data are consistent with it. The second was K-means, which imposes almost no structure and simply partitions the space by distance.

These are not two ways of doing the same thing. They rest on different assumptions and are vulnerable to different failure modes. A cluster that appears under both is not thereby proven real, but a cluster that appears under only one is a clear signal to stop and look before writing it into a recommendation.

On top of that we cross-validated across subsamples by sex, age group and region. A grouping that dissolves when you split the sample by region is telling you something about the sample, not about disease.

## Where this stops working

The limits are worth being explicit about, because the same logic gets over-applied.

Agreement between two methods is weaker evidence than it looks when both are fed the same badly constructed inputs. If the collapse from 12,618 subcategories to 123 groups was wrong, both methods inherit the error and agree beautifully on something false. Convergent validity is only as good as the step nobody validated.

The network analysis we ran on referral flows between facilities has a sharper version of this problem. Referral records document movement that actually happened. A gap in the network is genuinely ambiguous: it may mean patients do not need that path, or that the path exists but is not recorded, or that patients who needed it never got referred at all. The third case is the one that matters most for policy, and it is the one that leaves the least trace in the data. No amount of methodological triangulation fixes a variable that is missing by construction.

## The general point

When a method cannot tell you that it failed, you need an independent method that fails differently. This is not about robustness checks in the ritual sense — running the same specification with one more control — but about choosing procedures whose blind spots do not overlap.

The report from this project is not public, so I cannot link to the results. But the design question travels, and I have found myself returning to it in work that has nothing to do with health.
