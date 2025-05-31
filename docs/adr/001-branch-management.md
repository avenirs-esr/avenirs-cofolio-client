# ADR-001: Stratégie de Gestion des Branches Git

**Date:** 2025-06-02
**Statut:** Proposé
**Décideurs:** [Équipe de Développement]
**Histoire Technique:** Standardiser la gestion des branches Git pour améliorer la collaboration

## Contexte et Énoncé du Problème

Notre processus actuel de gestion des branches est très simple mais présente des limitations :

**Situation actuelle :**
- Une seule branche principale : `master`
- Toutes les features sont développées depuis `master`
- Pas d'environnement de staging/pré-production
- Merge direct vers `master` sans phase de test intégrée

**Problèmes identifiés :**
- **Risque de régression** : pas de phase de test d'intégration
- **Difficile de préparer des releases** avec plusieurs fonctionnalités
- **Pas de séparation** entre développement et code stable
- **Conflits potentiels** lors des merges simultanés
- **Manque de traçabilité** des fonctionnalités
- **Pas de possibilité de tests** d'intégration avant merge

Nous avons besoin d'une stratégie qui introduit un niveau d'intégration intermédiaire tout en gardant la simplicité.

## Facteurs de Décision

- **Simplicité**: Stratégie facile à comprendre et à suivre
- **Stabilité**: Assurer un code stable sur la branche principale
- **Collaboration**: Faciliter le travail en équipe
- **Flexibilité**: Permettre le développement parallèle de fonctionnalités
- **Traçabilité**: Historique clair des changements
- **Migration douce**: Transition naturelle depuis notre setup actuel

## Options Considérées

### Option 1: Maintenir le Status Quo (Master seul)
- Une seule branche master
- Feature branches temporaires
- Merge direct en production

### Option 2: Git Flow Complet
- Branches : main, develop, feature, release, hotfix
- Processus complexe avec nombreuses branches
- Overhead important pour notre équipe

### Option 3: GitHub Flow
- Une seule branche principale (main)
- Feature branches directement depuis main
- Pas de zone d'intégration
- Nécessite un deploiement continu pour être efficace

### Option 4: Stratégie Main + Develop (Recommandée)
- **Migration depuis master** : Renommer master → main
- **Créer develop** depuis main pour l'intégration
- **Feature branches** depuis develop
- **Préparation pour évolutions** futures

## Décision Retenue : Stratégie Main + Develop

### Votes
- [ ] Pascal
- [ ] julien
- [ ] Karim
- [ ] Bilel
- [ ] Mohammed
- [ ] Nathan
- [ ] Arnaud

**Deadline vote:** 2025-06-09
**Critères consensus:** Majorité simple (3/5)

## Structure des Branches

### Stratégie Main + Develop (Recommandée)

```
AVANT (situation actuelle):
master
├── feature/xyz (si branches temporaires)
└── direct commits/merges

APRÈS (cible):
main (renommage de master - code stable)
├── develop (nouvelle branche d'intégration)
    ├── feature/STORY-123-authentification-utilisateur
    ├── feature/STORY-124-tableau-de-bord
    ├── bugfix/BUG-456-correction-navigation
    └── task/TASK-789-mise-jour-dependances
```

### Types de Branches

| Type | Préfixe | Base | Merge vers | Exemple | Notes |
|------|---------|------|------------|---------|-------|
| **Feature** | `feature/` | `develop` | `develop` | `feature/STORY-123-login-form` | Nouvelles fonctionnalités |
| **Bugfix** | `bugfix/` | `develop` | `develop` | `bugfix/BUG-456-menu-mobile` | Corrections non-critiques |
| **Task** | `task/` | `develop` | `develop` | `task/TASK-789-update-deps` | Tâches techniques |
| **Hotfix** | `hotfix/` | `main` | `main` + `develop` | `hotfix/critical-security-fix` | Corrections critiques |

### Convention de Nommage

**Format**: `{type}/{ticket-id}-{description-courte}`

**Exemples valides**:
- `feature/STORY-123-authentification-oauth`
- `bugfix/BUG-456-correction-responsive`
- `task/TASK-789-migration-vue3`
- `hotfix/correction-critique-securite`

**Règles**:
- Utiliser des tirets (-) pour séparer les mots
- Description en français, courte et descriptive
- Inclure l'ID du ticket
- Pas d'espaces, caractères spéciaux ou accents

## Workflow de Développement

### 1. Développement de Fonctionnalité

```bash
# 1. Mettre à jour develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/STORY-123-dashboard-utilisateur

# 3. Développer avec commits conventionnels
git commit -m "feat: ajouter composant dashboard"
git commit -m "test: ajouter tests unitaires dashboard"

# 4. Pousser la branche
git push origin feature/STORY-123-dashboard-utilisateur

# 5. Créer une Pull Request vers develop
```

### 2. Processus de Review et Merge

**Pull Request vers `develop`:**
- ✅ Review de code par au moins 1 pair
- ✅ Tests a11y passent
- ✅ Pas de conflits
- ✅ Convention de commits respectée
- ✅ Rebase merge recommandé

### 3. Intégration vers Main

```bash
# Créer PR: develop → main
# Review finale de l'équipe
# Merge après validation
```

### 4. Hotfix Critique

```bash
# 1. Créer hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/correction-critique-securite

# 2. Faire la correction
git commit -m "fix: corriger faille de sécurité critique"

# 3. PR vers main ET develop
# 4. Merge prioritaire après review
```

## Règles de Protection des Branches

### Branche `main`
- ❌ Push direct interdit
- ✅ Pull Request obligatoire
- ✅ Review obligatoire (2 personnes)
- ✅ Tests CI obligatoires (si configurés)
- ✅ Branche à jour obligatoire
- ✅ Seuls les admins peuvent override

### Branche `develop`
- ❌ Push direct interdit
- ✅ Pull Request obligatoire
- ✅ Review obligatoire (1 personne)
- ✅ Tests CI obligatoires (si configurés)
- ✅ Branche à jour obligatoire

## Plan de Migration

### Phase 1: Migration de Master vers Main + Develop (Semaine 1)

**Étape 1: Renommer master → main**
```bash
# Sur GitHub: Settings → Branches → Rename master to main
# Ou via Git:
git branch -m master main
git push -u origin main
git push origin --delete master

# Mettre à jour les repos locaux de l'équipe:
git branch -m master main
git fetch origin
git branch -u origin/main main
```

**Étape 2: Créer develop depuis main**
```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

**Étape 3: Configuration GitHub**
- Changer la branche par défaut : `main` → `develop` (pour les nouvelles PR)
- Configurer les règles de protection
- Mettre à jour la documentation

### Pour l'Équipe Technique
- [ ] **Renommer master → main** sur GitHub et localement
- [ ] **Créer la branche develop** depuis main
- [ ] **Mettre à jour les règles de protection** des branches
- [ ] **Configurer develop comme branche par défaut** pour les PR

## Avantages Immédiats

Même sans environnements de déploiement configurés, cette stratégie apporte :

1. **Zone d'intégration sécurisée** avec develop
2. **Meilleure collaboration** avec conventions claires
3. **Réduction des conflits** grâce au processus structuré
4. **Traçabilité améliorée** des fonctionnalités
5. **Préparation future** pour évolutions du projet
6. **Stabilité accrue** du code sur main

## Métriques de Succès

### Métriques Quantitatives
- **Réduction des conflits de merge** : Cible 70% de réduction
- **Temps de résolution des conflits** : Réduction de 50%

### Critères de Succès
- [ ] Migration de master vers main réussie
- [ ] Branche develop opérationnelle
- [ ] Équipe formée et à l'aise avec le processus
- [ ] Premiers merges via develop → main réussis
- [ ] Aucun incident majeur pendant la transition

## Évolution Future

Cette stratégie nous prépare naturellement pour :
- **Environnements de staging/production**
- **Outils d'automatisation des releases**
- **Pipeline CI/CD complet**
- **Déploiements automatisés**
- **Monitoring et rollback** automatiques

*Cette ADR sera mise à jour après l'expérience d'utilisation et les retours de l'équipe.*
