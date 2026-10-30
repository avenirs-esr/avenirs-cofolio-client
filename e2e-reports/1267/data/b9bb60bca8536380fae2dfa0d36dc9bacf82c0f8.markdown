# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/home.feature.spec.js >> Student Home Page >> Profile Section >> Student bio is hidden when no bio available
- Location: .features-gen/tests/student/home.feature.spec.js:34:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByTestId('student-overview-widget')
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('student-overview-widget')
    24 × locator resolved to <div id="overview-widget" data-testid="student-overview-widget">…</div>
       - unexpected value "hidden"

```

```yaml
- navigation "Accès rapide":
  - list:
    - listitem:
      - link "Aller au contenu principal":
        - /url: "#main"
    - listitem:
      - link "Aller au pied de page":
        - /url: "#footer"
- banner:
  - link "Accueil - Cofolio Apprenant":
    - /url: /cofolio/student
    - img
  - button "Changer d'univers"
  - list:
    - listitem:
      - button "Notifications"
    - listitem:
      - button "J. moulin"
  - navigation:
    - button "FR"
  - navigation "Menu principal":
    - list:
      - listitem:
        - link "ACCUEIL":
          - /url: /cofolio/student
      - listitem:
        - link "MES ACTIVITÉS":
          - /url: /cofolio/student/activities
      - listitem:
        - link "MES COMPÉTENCES":
          - /url: /cofolio/student/skills
      - listitem:
        - button "MON PROJET DE VIE"
      - listitem:
        - button "MES OUTILS"
- main:
  - heading "Accueil Cofolio Apprenant" [level=1]
  - text: Ma bibliothèque d'activités Vous n’avez aucune activité dans votre bibliothèque pour le moment.
  - link "Voir toute ma bibliothèque d'activités":
    - /url: /cofolio/student/activities?tab=ACTIVITY_LIBRARY
  - text: Nouvelles activités
  - 'link "Activité \"Connaissance de soi\" : Définir ses valeurs"':
    - /url: /cofolio/student/activity-details/declared-activity-1
    - text: "Activité \"Connaissance de soi\" : Définir ses valeurs"
    - status: Me connaître
    - status: En cours
  - 'link "Activité \"CV\" : Construire son parcours"':
    - /url: /cofolio/student/activity-details/DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS
    - text: "Activité \"CV\" : Construire son parcours"
    - status: Cv
    - status: Inscrit(e)
  - 'link "Activité : Construire son parcours (soumise)"':
    - /url: /cofolio/student/activity-details/declared-activity-2
    - text: "Activité : Construire son parcours (soumise)"
    - status: Cv
    - status: Soumis pour feedback
  - link "Voir toutes les activités":
    - /url: /cofolio/student/activities
  - text: Mes dernières traces Vous n’avez encore ajouté aucune trace.
  - link "Voir toutes mes traces":
    - /url: /cofolio/student/tools/traces
- contentinfo:
  - link "Logo ANR":
    - /url: https://anr.fr/ProjetIA-21-DMAV-0001
    - img "Logo ANR"
  - link "Logo France 2030":
    - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
    - img "Logo France 2030"
  - text: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
  - img "Logo Cofolio"
  - text: Un ePortfolio pour l'Enseignement Supérieur et la Recherche Informations légales
  - list:
    - listitem:
      - 'link "Accessibilité : partiellement conforme"':
        - /url: /cofolio/student/accessibility
    - listitem:
      - link "Conditions générales d'utilisation":
        - /url: /cofolio/student/cgu
    - listitem:
      - link "Données personnelles":
        - /url: /cofolio/student/personal-data
    - listitem:
      - link "Gestion des cookies":
        - /url: /cofolio/student/cookies
  - text: Autres sites
  - list:
    - listitem:
      - link "Volet ESR du programme AVENIR(s) - Accueil":
        - /url: https://avenirs-esr.fr/
        - text: avenirs-esr.fr
  - text: Partenaires
  - link "Volet ESR du programme AVENIR(s) - Accueil":
    - /url: https://avenirs-esr.fr/
    - img "Logo Avenir(s) ESR"
  - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil":
    - /url: https://www.esup-portail.org/
    - img "Logo Esup Portail"
  - link "@ESUP-Portail. Tous droits réservés. - Accueil":
    - /url: https://www.esup-portail.org/
    - text: "@ESUP-Portail. Tous droits réservés."
```

# Test source

```ts
  1  | import type { Locator, Page } from '@playwright/test'
  2  | import { expect } from '@playwright/test'
  3  | 
  4  | export abstract class BaseObject {
  5  |   protected constructor (protected readonly root: Locator, protected page?: Page) { }
  6  | 
  7  |   getRoot () {
  8  |     return this.root
  9  |   }
  10 | 
  11 |   async click () {
  12 |     await this.root.click()
  13 |   }
  14 | 
  15 |   async isVisible () {
> 16 |     await expect(this.root).toBeVisible()
     |                             ^ Error: expect(locator).toBeVisible() failed
  17 |   }
  18 | 
  19 |   async isHidden () {
  20 |     await expect(this.root).toBeHidden()
  21 |   }
  22 | }
  23 | 
```