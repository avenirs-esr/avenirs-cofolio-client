# Architecture Decision Records (ADR)

Ce répertoire contient les Architecture Decision Records de ce projet, documentant les décisions architecturales et techniques importantes prises par notre équipe de développement.

## Qu'est-ce qu'un ADR ?

Les Architecture Decision Records (ADRs) sont des documents qui capturent les décisions architecturales importantes avec leur contexte et leurs conséquences. Ils aident les équipes à :

- **Documenter le raisonnement** derrière les décisions techniques
- **Partager les connaissances** avec les membres actuels et futurs de l'équipe
- **Suivre l'évolution** des choix architecturaux dans le temps
- **Éviter de répéter** les discussions passées
- **Faciliter l'onboarding** des nouveaux développeurs avec le contexte historique

## Index des ADRs

| ADR                                            | Titre | Statut | Date | Décision |
|------------------------------------------------|-------|--------|------|----------|
| [001](./002-strategie-gestion-branches-git.md) | Stratégie de Gestion des Branches Git | Proposé | 2025-06-02 | Adopter la stratégie main + develop |

## Statuts des ADRs

- **🟡 Proposé** - En cours de discussion et de révision
- **🔵 En Révision** - Révision technique en cours
- **🟢 Accepté** - Approuvé et en cours d'implémentation
- **🔴 Rejeté** - Considéré mais non retenu
- **🟠 Suspendu** - Reporté à plus tard
- **⚪ Remplacé** - Remplacé par un nouvel ADR
- **⚫ Obsolète** - Plus d'actualité


### 2. Convention de Nommage

- **Numéro** : Séquentiel (001, 002, 003...)
- **Nom** : Minuscules avec tirets
- **Langue** : Français pour les ADRs internes à l'équipe

### 3. Sections Obligatoires

Chaque ADR doit inclure :

- **Contexte et Énoncé du Problème** : Pourquoi cette décision est-elle nécessaire ?
- **Facteurs de Décision** : Quels facteurs ont influencé la décision ?
- **Options Considérées** : Quelles alternatives ont été évaluées ?
- **Décision Retenue** : Qu'est-ce qui a été choisi et pourquoi ?
- **Conséquences** : Impacts positifs et négatifs

### 4. Processus de Workflow

```bash
# 1. Créer une branche ADR
git checkout develop
git checkout -b docs/TICKET-XXX-adr-nom-sujet

# 2. Rédiger l'ADR avec le statut "Proposé"
# Utiliser le template et remplir toutes les sections

# 3. Commiter et créer une PR
git add docs/adr/XXX-nom-sujet.md
git commit -m "docs: ajouter ADR-XXX nom du sujet

- Propose une solution pour [problème]
- Inclut l'analyse des alternatives
- Statut : Proposé pour révision équipe"

# 4. Révision et discussion en équipe
# Mettre à jour l'ADR selon les retours
```

### 5. Processus de Décision

1. **Proposition** (Statut : Proposé)
  - Commit + PR pour discussion
  - Révision équipe (1 semaine)

2. **Discussion** (Statut : En Révision)
  - Commentaires et suggestions
  - Modifications si nécessaire

3. **Décision** (Statut : Accepté/Rejeté)
  - Vote formel ou consensus
  - Mise à jour du statut

4. **Implémentation**
  - Suivi de l'ADR accepté
  - Mises à jour si nécessaire

## Template ADR

Chaque ADR doit suivre cette structure :

```markdown
# ADR-XXX: Titre de la Décision

**Date:** YYYY-MM-DD
**Statut:** Proposé/Accepté/Rejeté
**Décideurs:** [Équipe de Développement]
**Histoire Technique:** Brève description

## Contexte et Énoncé du Problème
[Décrire le contexte et le problème à résoudre]

## Facteurs de Décision
[Lister les facteurs qui influencent la décision]

## Options Considérées
[Décrire les alternatives évaluées]

## Décision Retenue
[Expliquer la décision finale]

## Conséquences
[Décrire les impacts positifs et négatifs]
```