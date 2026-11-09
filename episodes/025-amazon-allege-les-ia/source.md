# Source — Your Experts Have Partners. There's HOPE for Keeping Them Together
- URL : https://huggingface.co/blog/amazon/higher-order-pruning-experts
- Publié par : Amazon (sur Hugging Face)
- Auteur : Alex M Tseng (avec Prannay Kaul, Luca Zancato, Wei Xia, Stefano Soatto)
- Date de publication : 2026-11-09
- Type : blog
- Statut : disponible — « We created a basic package to run HOPE. It has three steps: 1) calibrate; 2) solve; 3) prune. »
- Langue : en

## Fiche

### Faits
- Les modèles de type Mixture-of-Experts (MoE) permettent de monter à des centaines de milliards de paramètres, mais chaque sous-réseau d'expert (MLP) doit rester chargé en mémoire lors de l'inférence même si seule une poignée est sollicitée pour chaque token.
- L'élagage d'experts (expert pruning) consiste à supprimer définitivement les experts les moins utiles, ce qui réduit l'empreinte mémoire sans exiger de réentraînement, sans latence de chargement dynamique et en restant combinable avec la quantification.
- Les approches d'élagage existantes (méthodes du premier ordre) attribuent à chaque expert un score d'importance scalaire calculé isolément, en supposant l'indépendance de chaque expert vis-à-vis des autres.
- En réalité, les experts au sein d'une couche MoE s'organisent en grappes coopératives stables qui sont systématiquement co-activées ensemble dès le début de l'apprentissage.
- Supprimer un expert jugé individuellement peu important peut désactiver ou dégrader un autre expert hautement critique avec lequel il forme un binôme coopératif, détruisant la cohésion du réseau.
- L'effet de destruction des groupes coopératifs s'amplifie fortement à des taux d'élagage agressifs (jusqu'à 50 % d'experts supprimés).
- Amazon (awslabs) propose HOPE (Higher-Order Pruning of Experts), une méthode du second ordre qui intègre les interactions par paires entre experts pour choisir le sous-ensemble optimal à supprimer.
- La minimisation exacte de l'erreur d'élagage étant mathématiquement intraitable, HOPE utilise un substitut analytique qui constitue une borne supérieure stricte sur la composante dominante de l'erreur.
- Ce problème d'optimisation est formulé sous la forme d'un programme quadratique (QP) binaire, résolu en pratique par relaxation continue puis arrondi en solution binaire.
- La matrice d'interaction F est construite à l'aide d'une seule passe avant sur un ensemble de calibration : la diagonale encode l'importance individuelle de chaque expert (hautement corrélée à la méthode REAP, Spearman ρ = 0,988), et les termes hors diagonale mesurent la coopération par paire.
- Le surcoût de HOPE par rapport aux méthodes de premier ordre est négligeable : la résolution du programme quadratique prend seulement 1 à 2 secondes par couche, la passe de calibration dominant l'essentiel du temps.
- Sur 3 modèles testés (Qwen3.5-122B, Qwen3.5-35B, GLM-4.5-Air) comparés à 4 méthodes de base (REAP, MAN, EAN, Frequency), HOPE obtient le meilleur classement moyen (2,07 sur 5) et domine à 50 % d'élagage (rang moyen de 1,58 contre 2,42 pour REAP).
- Le bénéfice de HOPE est particulièrement marqué sur les tâches complexes d'agents de code (benchmark SWE-Bench Pro), où les problèmes multi-tours mobilisent des combinaisons variées d'experts coopératifs.
- Sur Qwen3.5-35B-A3B élagué à 50 %, HOPE atteint 42,3 sur SWE-Bench Pro, égalant le modèle complet non élagué (41,8), tandis que REAP chute à 36,2 (perte de 13 %).
- Les experts retenus par HOPE plutôt que par REAP affichent systématiquement un score de coopération supérieur avec le reste du modèle : HOPE privilégie la préservation des grappes coopératives au détriment d'experts isolés aux scores individuels élevés.
- Les modèles élagués peuvent ponctuellement surpasser le modèle d'origine non élagué, l'élagage éliminant des experts peu pertinents agissant comme du bruit sur la tâche cible.
- Une calibration spécialisée sur du code ne dégrade pas significativement les performances sur des tâches généralistes (suite Tulu3).
- HOPE génère un checkpoint Hugging Face standard plus léger sur disque et en mémoire vive, immédiatement exploitable avec vLLM ou SGLang sans modification d'architecture.
- HOPE présente des limites : son avantage est modeste à faible taux d'élagage (10–20 %), l'élagage s'opère couche par couche sans optimiser les interactions inter-couches, et les interactions d'ordre 3 ou plus ne sont pas modélisées.

### Chiffres
- 256 — nombre d'experts par couche MoE dans Qwen3.5-122B — « Qwen3.5-122B has 256 experts in each of its 48 MoE layers »
- 48 — nombre de couches MoE dans le modèle Qwen3.5-122B — « Qwen3.5-122B has 256 experts in each of its 48 MoE layers »
- 95% — part de l'empreinte mémoire des paramètres monopolisée par les seuls MLP d'experts dans Qwen3.5-122B — « 95% of its ~250 GB parameter memory footprint is taken up entirely by these expert MLPs alone. »
- ~250 GB — empreinte mémoire totale des paramètres du modèle Qwen3.5-122B — « 95% of its ~250 GB parameter memory footprint is taken up entirely by these expert MLPs alone. »
- 8 — nombre d'experts activés pour chaque token dans Qwen3.5-122B — « However, for any given token, only 8 experts in each layer are actually used. »
- K = 8 — nombre typique d'experts activés simultanément par token — « ( K = 8 is a typical choice). »
- 50% — taux d'élagage agressif évalué pour HOPE — « At 50% pruning, HOPE achieves the best average rank of any method »
- +6.1% — gain de performance maximal de HOPE par rapport à la méthode suivante sur les tâches d'agents de code — « with gains of up to +6.1% on agentic coding tasks over the next-best pruning method. »
- 128 — nombre d'experts par couche pour le modèle GLM-4.5-Air — « GLM-4.5-Air (128 experts per layer, 106B parameters total) »
- 106B — nombre total de paramètres du modèle GLM-4.5-Air — « GLM-4.5-Air (128 experts per layer, 106B parameters total) »
- 1–2 seconds — durée d'exécution de la résolution du programme quadratique par couche — « can be solved efficiently via a standard QP solver (1–2 seconds each layer). »
- ρ = 0.988 — corrélation de Spearman entre la diagonale de la matrice F et les scores d'experts de REAP — « The diagonal of F recovers REAP's expert rankings almost perfectly (Spearman ρ = 0.988). »
- 3 — nombre de modèles de langage testés expérimentalement — « We evaluated HOPE as an expert pruning method using 3 models (Qwen3.5-122B, Qwen3.5-35B, and GLM-4.5-Air) »
- 2 — nombre de jeux de données de calibration employés — « with 2 calibration datasets (Evol-CodeAlpaca and SWE-Bench Verified trajectories). »
- 4 — nombre de méthodes de référence de premier ordre comparées — « comparing HOPE to 4 first-order baselines (REAP, MAN, EAN, and Frequency) »
- 10% to 50% — étendue des taux d'élagage testés — « across pruning rates spanning from 10% to 50%. »
- 2.07 — rang moyen global obtenu par HOPE sur 5 méthodes à travers l'ensemble des conditions — « Across all conditions, HOPE achieved the best average rank (2.07 out of 5 methods) »
- 39% — pourcentage des conditions où HOPE arrive en première position — « with the highest rate of top-1 finishes (39% of conditions) »
- 67% — pourcentage des conditions où HOPE se classe dans les deux premières places — « and top-2 finishes (67%). »
- 1.58 — rang moyen de HOPE avec un taux d'élagage de 50 % — « At 50% pruning, HOPE's average rank improves to 1.58 (vs. 2.42 for the next-best method, REAP). »
- 2.42 — rang moyen de la méthode REAP avec un taux d'élagage de 50 % — « (vs. 2.42 for the next-best method, REAP). »
- 42.3 — score obtenu par HOPE sur SWE-Bench Pro pour Qwen3.5-35B-A3B élagué à 50 % — « On Qwen3.5-35B-A3B at 50% pruning, HOPE achieved 42.3 on SWE-Bench Pro »
- 41.8 — score sur SWE-Bench Pro du modèle de base non élagué Qwen3.5-35B-A3B — « matching the unpruned model's 41.8 »
- 36.2 — score sur SWE-Bench Pro obtenu par REAP pour Qwen3.5-35B-A3B élagué à 50 % — « (while REAP dropped to 36.2, a 13% regression). »
- 13% — régression de REAP par rapport au modèle d'origine sur SWE-Bench Pro — « (while REAP dropped to 36.2, a 13% regression). »
- 40–50% — intervalle de taux d'élagage où l'avantage de HOPE est prédominant — « HOPE's advantage is most pronounced at higher pruning rates (40–50%). »
- 10–20% — intervalle de taux d'élagage faibles où les méthodes de premier ordre restent compétitives — « At lower pruning rates (10–20%), first-order methods like REAP and MAN are sometimes competitive »

### Citations utilisables (≤ 15 mots)
- « Mixture-of-Experts models have enabled state-of-the-art LLMs to be scaled to hundreds of billions of parameters » — Alex M Tseng
- « The difficulty lies in deciding which experts are safest to remove. » — Alex M Tseng
- « In reality, experts form cooperative groups. » — Alex M Tseng
- « Ignoring these interactions leads to suboptimal pruning, especially at aggressive rates. » — Alex M Tseng
- « When we remove up to 50% of experts, we risk breaking many cooperative links. » — Alex M Tseng
- « HOPE sacrifices some individually high-scoring experts in favor of preserving cooperative clusters. » — Alex M Tseng
- « Pruned models can occasionally match or exceed the unpruned baseline » — Alex M Tseng

### Disponibilité
- Code source et package CLI/Python disponibles gratuitement en open source sur GitHub (`https://github.com/awslabs/HOPE`).
- Article scientifique complet en accès libre sur arXiv (`https://arxiv.org/abs/2609.18916`).
- Testé et validé sur Qwen3, Qwen3-Next, Qwen3.5 et GLM-4.5.
- Compatible avec Hugging Face Transformers, vLLM et SGLang sans modification de runtime.
- Accessible immédiatement à tous les développeurs et chercheurs sans frais ni liste d'attente.

### Zones floues
- Le volume minimal recommandé de données de calibration (nombre exact de tokens ou d'échantillons) pour obtenir une matrice d'interaction F stable n'est pas précisé dans le billet.
- L'élagage inter-couches (cross-layer) n'est pas encore implémenté dans le code public, le cadre théorique restant préliminaire.
- La méthode ignore les interactions d'ordre supérieur à 2 (groupes de 3 experts ou plus), jugées combinatoirement trop lourdes à calculer.
- Les gains réels en vitesse d'inférence (latence en ms par token, débit tokens/seconde) et en consommation mémoire VRAM mesurés sur des GPU de production (A100/H100) ne sont pas quantifiés dans l'article.
- À taux d'élagage faible (10 à 20 %), l'intérêt de la méthode par rapport à des approches de premier ordre plus simples comme REAP ou MAN n'est pas démontré.

## Texte de l'article

## Higher-Order Pruning of Experts in Mixture-of-Experts Language Models

### Introduction

Mixture-of-Experts (MoE) models have enabled state-of-the-art LLMs to be scaled to hundreds of billions of parameters, but they come with a fundamental and costly caveat: every expert MLP must occupy memory at inference time, even though the vast majority are idle for any given token. For example, Qwen3.5-122B has 256 experts in each of its 48 MoE layers, and 95% of its ~250 GB parameter memory footprint is taken up entirely by these expert MLPs alone. However, for any given token, only 8 experts in each layer are actually used.

**Expert pruning** is one of the most direct fixes to this memory bottleneck. That is, permanently delete the least useful experts. Pruning avoids the latency issues which make dynamic loading/off-loading of experts impractical; it does not require any training; and [it composes with quantization](https://arxiv.org/abs/2510.13999). Given these attractive benefits and the simplicity of the idea, it's easy to see why expert pruning has become a go-to approach for shrinking MoEs. The difficulty lies in deciding *which* experts are safest to remove.

Existing pruning methods score each expert independently, assigning every expert a scalar importance score (based on a calibration dataset), and cutting out the least important experts (in each layer independently). These are **first-order** methods, because they assume each expert's contribution is independent of all others. In reality, experts form cooperative groups. We observe consistent clusters of co-activated experts in our own experiments, and independent work has shown that [expert cooperation is a stable property of MoEs](https://arxiv.org/abs/2505.20225) and [is important for model performance](https://arxiv.org/abs/2510.16411). Ignoring these interactions leads to suboptimal pruning, especially at aggressive rates.

[Our newest paper](https://arxiv.org/abs/2609.18916) derives **HOPE** (Higher-Order Pruning of Experts), a **second-order** method that accounts for pairwise expert interactions. At 50% pruning, HOPE achieves the best average rank of any method, with gains of up to +6.1% on agentic coding tasks over the next-best pruning method.

In this post, we explain how HOPE works, show where it outperforms existing methods, and walk through how to use it for your own models. For readers unfamiliar with MoE architectures, see [Mixture of Experts (MoEs) in Transformers](https://huggingface.co/blog/moe-transformers).

### Experts don't work alone

In a standard MoE, each layer has $E$ experts, and each input token $x$ is routed independently to $K$ such experts ( $K = 8$ is a typical choice). Routing is performed by a single layer which produces softmax-normalized gate weights $g_{k}(x)$ for each expert $k$, wherein the $K$ experts with the highest gate weights are selected to form the active set of experts, $T(x) \subset\{1,..,E\}$. The output of the layer is then $\sum\limits_{k\in T(x)}g_{k}(x)f_{k}(x)$, where $f_{k}(x)$ is the output of expert $k$ for token $x$.

![pruning_cartoon](https://cdn-uploads.huggingface.co/production/uploads/6ab2f79bd8000a811c648a32/ZTLrZSA4pDn81OVRHtCXq.png)

*Left: typical MoE layer, where each token is routed to the top-K experts. Right: first-order methods rank and delete experts based on a scalar importance score, but the best pruning decisions will also consider the strength of interactions between experts.*

Importantly, experts in the selected set $T(x)$ are not independent. Experts form stable cooperative groups that get consistently co-activated together. This has been observed [before in the literature](https://arxiv.org/abs/2505.20225), as well: expert co-selection patterns emerge early in training and stabilize throughout.

This means that when we prune experts from an MoE layer, pruning decisions need to consider the higher-order effects between these experts. Removing expert A might seem fine on its own, but if expert B—which frequently cooperates with and relies on A—is highly important, then removing A would dismantle a cooperative group just through a single deletion. First-order methods miss this entirely, because they score A and B separately.

This effect compounds at high pruning rates. When we remove up to 50% of experts, we risk breaking many cooperative links. This is where second-order pruning is most advantageous.

### How HOPE identifies a prune-set

*(See Appendix A in [our corresponding paper](https://arxiv.org/abs/2609.18916) for the full derivation of the HOPE objective)*

When we delete a set of $P$ experts from some MoE layer, the selected set of experts $T(x)$ (for any token $x$) can change. The pruned experts that *would have* been selected are replaced by the experts with the next-highest gate weights. The resulting change in layer output is the **pruning error**. Our goal is to find the prune-set $P$ (of some predefined pruning budget $\vert P\vert$) that *minimizes* the resulting pruning error (over tokens $x$ from our calibration set).

Unfortunately, minimizing the pruning error over $P$ directly is intractable. The pruning error depends on the identities of the replacement experts, which in turn depend on the prune-set $P$ itself. HOPE sidesteps this by defining a tractable surrogate $Z$, which strictly upper-bounds the dominant component of the pruning error:

$$Z = \bigl[\sum\limits_{j \in P\cap T(x)} g_{j}(x)\Vert f_j(x)\Vert_{2}\bigr]^{2} \geq \text{true error}$$

Because $Z$ is a squared sum, expanding it naturally produces cross-terms $g_{i}(x)g_{j}(x)\Vert f_{i}(x)\Vert_{2}\Vert f_{j}(x)\Vert_{2}$ between pairs of experts. These are the interaction terms that first-order methods discard.

To find the optimal prune-set, HOPE minimizes $\mathbb{E}[Z]$ over the calibration set, which can be reformulated as the following quadratic program:

$$P^{*} = \argmin_{p}\; p^{\top}Fp \quad \text{s.t.} \quad p \in \{0,1\}^{E}, \sum\limits_{k=1}^{E}p_{k} = \vert P\vert$$

where $F\in\mathbb{R}^{E\times E}$ is defined as:

$$F_{i,j} = \frac{1}{\vert \mathcal{X}_{i,j}\vert} \sum\limits_{x\in\mathcal{X}_{i,j}} g_{i}(x)g_{j}(x)\Vert f_{i}(x)\Vert_{2}\Vert f_{j}(x)\Vert_{2}\quad\text{where}\quad \mathcal{X}_{i,j} = \{x: i,j \in T(x)\}$$

This F-matrix is collected on the calibration dataset, and the optimal prune-set is obtained by solving the resulting quadratic program (QP) with a continuous relaxation (then rounding to binary solutions). Each entry $F_{i,j}$ captures the average gate-weighted output product of experts $i$ and $j$, across tokens where both are co-activated. Whereas the diagonal $F_{k,k}$ measures *individual* expert importance, the off-diagonal entries ( $F_{i,j}$ for $i\neq j$) measure pairwise *cooperative* contribution.

What does $F$ look like in practice? It shows the structure of expert cooperation, which depends on layer:

![fmatrix](https://cdn-uploads.huggingface.co/production/uploads/6ab2f79bd8000a811c648a32/xyjeUqqFm2FtQtKVdZhwq.png)

*Visualization of the interaction matrix F for GLM-4.5-Air (128 experts per layer, 106B parameters total) at three representative layers (early, middle, late). Experts have been clustered to reveal block structure. Bright blocks along the diagonal indicate groups of experts with strong pairwise interaction scores.*

In terms of practical cost, HOPE requires the same calibration pass as any other expert-pruning method (one forward pass over calibration data). The only addition is solving the quadratic program, which is non-convex, but can be solved efficiently via a standard QP solver (1–2 seconds each layer). The total additional overhead is negligible compared to first-order methods, as the time for calibration dominates.

#### Connection to REAP

Notably, HOPE has a strong connection to [Router-weighted Expert Activation Pruning (REAP)](https://arxiv.org/abs/2510.13999), a state-of-the-art first-order expert-pruning method. HOPE's F-matrix encodes individual expert importance scores on the diagonal, and this diagonal effectively recovers the scores used by REAP to independently rank experts for pruning (differing only by the variance of expert contributions). The diagonal of $F$ recovers REAP's expert rankings almost perfectly (Spearman $\rho = 0.988$). Thus, any improvement HOPE achieves over REAP is attributable to the second-order interaction terms in the off-diagonal entries of the $F$-matrix.

### Results

We evaluated HOPE as an expert pruning method using 3 models (Qwen3.5-122B, Qwen3.5-35B, and GLM-4.5-Air), with 2 calibration datasets (Evol-CodeAlpaca and SWE-Bench Verified trajectories). We used the Tulu3 suite and SWE-Bench Pro (agentic coding) to test the resulting pruned models, comparing HOPE to 4 first-order baselines ([REAP](https://arxiv.org/abs/2510.13999), [MAN](https://arxiv.org/abs/2606.15716), [EAN](https://arxiv.org/abs/2504.05586), and Frequency) across pruning rates spanning from 10% to 50%.

![results](https://cdn-uploads.huggingface.co/production/uploads/6ab2f79bd8000a811c648a32/5ArwjL0FoYK6nW1eazSzF.png)

*HOPE achieves the best overall rank across conditions and dominates at aggressive pruning rates. Left: average rank (lower = better) across all models, calibration sets, and benchmarks. Right: SWE-Bench Pro performance on Qwen3.5-35B.*

Across all conditions, HOPE achieved the best average rank (**2.07** out of 5 methods), with the highest rate of top-1 finishes (**39%** of conditions) and top-2 finishes (**67%**). In a head-to-head comparison, HOPE beats every other baseline in the majority of conditions.

As expected, **HOPE's advantage grows at higher pruning rates.** As more experts are removed, more cooperative links are broken, and the off-diagonal terms of $F$ become more important. At 50% pruning, HOPE's average rank improves to **1.58** (vs. **2.42** for the next-best method, REAP). This is also the most deployment-relevant setting, where memory savings are large enough to accommodate longer contexts, deeper reasoning, and more tool calls.

HOPE's advantage is most pronounced on **SWE-Bench Pro**, an agentic coding benchmark where models must solve real GitHub issues autonomously. These problems involve compositionally diverse tasks (e.g. coding, tool calls, reasoning, etc.) over many turns and likely exercise diverse expert combinations—exactly the regime where preserving cooperative structure matters most. On Qwen3.5-35B-A3B at 50% pruning, HOPE achieved **42.3** on SWE-Bench Pro, matching the unpruned model's **41.8** (while REAP dropped to **36.2**, a 13% regression).

Notably, pruned models can occasionally match or exceed the unpruned baseline, likely because the removal of low-relevance experts reduces noise on the target tasks. This effect is not unique to HOPE and [has been observed across pruning methods](https://arxiv.org/abs/2504.06792). Furthermore, our experiments showed that code-focused calibration with any pruning method (including HOPE) did not severely degrade non-coding benchmarks, and HOPE performed well across the Tulu3 suite regardless of calibration set.

#### HOPE retains more cooperating experts

![exp_interaction_breakdown](https://cdn-uploads.huggingface.co/production/uploads/6ab2f79bd8000a811c648a32/S2fm99InMXuhOUFqEbI_2.png)

*Average strength of cooperation (measured by F-matrix value) with retained experts, split by experts on which HOPE and REAP disagree.*

HOPE's advantage stems from optimizing over the entire interaction matrix $F$. To understand how this affects pruning decisions in practice, we examine the experts where HOPE and REAP disagree. For each disputed expert, we compute its *cooperative score* (i.e. its average F-value with other retained experts). Experts retained only by HOPE consistently have *higher cooperative scores* than experts retained only by REAP. In other words, as part of the QP optimization, HOPE sacrifices some individually high-scoring experts in favor of preserving cooperative clusters. The gains in benchmark performance (shown above) validate that this trade-off is advantageous.

### How to run HOPE

![pipeline](https://cdn-uploads.huggingface.co/production/uploads/6ab2f79bd8000a811c648a32/b8EewrlBWbGA0DlrBKa2E.png)

We created a basic [package](https://github.com/awslabs/HOPE) to run HOPE. It has three steps: 1) calibrate; 2) solve; 3) prune. Our package has been tested on Qwen3, Qwen3-Next, Qwen3.5, and GLM-4.5.

#### Step 1: Calibrate

```bash
hope calibrate \
    --model-path Qwen/Qwen3.5-35B-A3B \
    --prompts calibration_prompts.txt \
    --out-path observations.h5
```

The calibration step runs a single forward pass over calibration data, whether it be agentic rollouts or single-turn traces. This uses HuggingFace `transformers` to hook into the forward pass of each individual MoE layer. For each token, this records which experts are selected, their gate weights, output norms, and pairwise co-activation statistics. The output of this step is the F-matrix, stored in an HDF5 file.

#### Step 2: Solve QP

```bash
hope solve \
    --obs-path observations.h5 \
    --prune-frac 0.50 \
    --out-path pruneset.json
```

This command materializes the F-matrix and solves the binary quadratic program via a continuous relaxation. This takes a few seconds per layer, and the output is a JSON file which contains the prune-set. This is technically the final output of the HOPE algorithm.

#### Step 3: Prune

```bash
hope prune \
    --model-path Qwen/Qwen3.5-35B-A3B \
    --pruneset-path pruneset.json \
    --out-path ./Qwen3.5-35B-A3B-pruned-50
```

To complete the pipeline, we run this command to actually create the smaller model checkpoint from the prune-set. The pruned model is a standard HuggingFace checkpoint which is smaller on disk and in memory (no changes to vLLM or SGLang model definitions needed).

We also released a more compact Python API:

```python
from hope.calibrate import calibrate
from hope.solve import solve
from hope.prune import prune_model

calibrate("Qwen/Qwen3.5-35B-A3B", calibration_prompts, "observations.h5")
solve("observations.h5", prune_frac=0.50, out_path="pruneset.json")
prune_model("Qwen/Qwen3.5-35B-A3B", "pruneset.json", "./Qwen3.5-35B-A3B-pruned-50")
```

### Limitations of HOPE

HOPE's advantage is most pronounced at higher pruning rates (40–50%). At lower pruning rates (10–20%), first-order methods like REAP and MAN are sometimes competitive, and HOPE's advantage shrinks. Additionally, as with most expert-pruning algorithms, HOPE prunes each layer independently and does not account for cross-layer interactions. In our paper, we presented a theoretical framework for cross-layer HOPE, but the results remain preliminary. Finally, HOPE captures pairwise interactions, but even higher-order interactions (triplets and beyond) could provide additional signal, although they are combinatorially difficult to estimate.

### More information

For more information, see our corresponding paper and codebase.

**Paper:** [https://arxiv.org/abs/2609.18916](https://arxiv.org/abs/2609.18916)

**Code**: [https://github.com/awslabs/HOPE](https://github.com/awslabs/HOPE)

To see how HOPE can be applied to next-generation hybrid architectures, see our [corresponding repository](https://github.com/awslabs/hybrid-model-factory/).

**Citation:**

```
@article{tseng2026hope,
    title={Higher-Order Pruning of Experts in Mixture-of-Experts Language Models},
    author={Tseng, Alex M. and Kaul, Prannay and Zancato, Luca and Xia, Wei and Soatto, Stefano},
    journal={arXiv preprint arXiv:2609.18916},
    year={2026},
}
```
