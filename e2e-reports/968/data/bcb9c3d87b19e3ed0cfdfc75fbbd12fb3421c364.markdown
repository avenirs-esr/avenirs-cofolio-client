# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/staff/home.feature.spec.js >> Staff Home Page >> Page Load and Basic Display >> Staff can load home page successfully
- Location: .features-gen/tests/staff/home.feature.spec.js:12:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:4173/cofolio/staff"
Received: "http://localhost:4173/cofolio/student"
Timeout:  10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    24 × unexpected value "http://localhost:4173/cofolio/student"

```

```yaml
- banner:
  - link "Accueil - Cofolio Étudiant":
    - /url: /cofolio/student
    - img
  - button "Changer d'univers"
  - list:
    - listitem:
      - button "Messagerie"
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
        - button "CONSTRUIRE MON PROJET DE VIE"
      - listitem:
        - button "MES OUTILS"
- main:
  - heading "Accueil Cofolio Étudiant" [level=1]
  - img "Bannière du profil"
  - img "Photo de profil"
  - text: Jeanne Moulin Je suis étudiante en chimie et écologie. Passionnée par l'innovation durable, je souhaite utiliser la science pour protéger l'environnement et bâtir un avenir plus respectueux de la planète.
  - list:
    - listitem:
      - button "Modifier mon profil"
  - text: Nouvelles activités
  - 'link "Activité \"Connaissance de soi\" : Définir ses valeurs"':
    - /url: /cofolio/student/activity/declared-activity-1
    - text: "Activité \"Connaissance de soi\" : Définir ses valeurs"
    - status: Me connaître
    - status: En cours
  - 'link "Activité \"CV\" : Construire son parcours"':
    - /url: /cofolio/student/activity/DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS
    - text: "Activité \"CV\" : Construire son parcours"
    - status: CV
    - status: Inscrit(e)
  - 'link "Activité : Construire son parcours (soumise)"':
    - /url: /cofolio/student/activity/declared-activity-2
    - text: "Activité : Construire son parcours (soumise)"
    - status: CV
    - status: Soumis
  - link "Voir toutes les activités":
    - /url: /cofolio/student/project/activities
  - text: Ma bibliothèque d'activités
  - 'link "Activité \"Connaissance de soi\" : Définir ses valeurs"':
    - /url: /cofolio/student/activity/declared-activity-1
    - text: "Activité \"Connaissance de soi\" : Définir ses valeurs"
    - status: Me connaître
    - status: En cours
  - 'link "Activité \"CV\" : Construire son parcours"':
    - /url: /cofolio/student/activity/DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS
    - text: "Activité \"CV\" : Construire son parcours"
    - status: CV
    - status: Inscrit(e)
  - 'link "Activité : Construire son parcours (soumise)"':
    - /url: /cofolio/student/activity/declared-activity-2
    - text: "Activité : Construire son parcours (soumise)"
    - status: CV
    - status: Soumis
  - link "Voir toute ma bibliothèque d'activités":
    - /url: /cofolio/student/project/activities?tab=ACTIVITY_LIBRARY
  - text: Mes dernières traces
  - link "Prévenir la pollution à la source":
    - /url: /cofolio/student/trace/4453f884-9081-43cb-95c6-d76c2bb59fd7
    - text: Prévenir la pollution à la source
    - status: Individuel
    - status: Sans IA
  - link "Mettre en place des filières d'économies circulaires":
    - /url: /cofolio/student/trace/trace2
    - text: Mettre en place des filières d'économies circulaires
    - status: Collectif
    - status: Avec IA
  - link "Évaluer l'impact environnemental et économique":
    - /url: /cofolio/student/trace/trace3
    - text: Évaluer l'impact environnemental et économique
    - status: Individuel
    - status: Sans IA
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
      - link "Mentions légales":
        - /url: /cofolio/student/legal
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
  1  | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2  | import { BasePage } from '@e2e/framework/shared/base/BasePage'
  3  | import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
  4  | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  5  | import { StaffLayout } from '@e2e/framework/staff/shared/componentObjects/StaffLayout'
  6  | import { expect, type Page } from '@playwright/test'
  7  | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  8  | 
  9  | export
  10 | @Fixture<typeof test>('staffGlobalSteps')
  11 | class StaffGlobalSteps extends BasePage {
  12 |   private layout: StaffLayout
  13 | 
  14 |   constructor (page: Page) {
  15 |     super(page)
  16 |     this.layout = new StaffLayout(page)
  17 |   }
  18 | 
  19 |   @Given('the staff opens the home page')
  20 |   async goToHomePage () {
  21 |     await this.page.goto(STAFF_ROUTES.HOME)
  22 |     await waitForPageLoad(this.page)
  23 |   }
  24 | 
  25 |   @Then('the staff home page is displayed')
  26 |   async verifyPageLoaded () {
> 27 |     await expect(this.page).toHaveURL(STAFF_ROUTES.HOME)
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  28 |   }
  29 | 
  30 |   @When('the user click on the ACTIVITIES link')
  31 |   async clickActivitiesLink () {
  32 |     await this.layout.getActivitiesNavLink().click()
  33 |   }
  34 | 
  35 |   @Then('the page navigates to activities page')
  36 |   async verifyNavigationToActivitiesPage () {
  37 |     await expect(this.page).toHaveURL(STAFF_ROUTES.ACTIVITIES)
  38 |   }
  39 | 
  40 |   @Then('the staff HOME link is visible')
  41 |   async verifyHomeLink () {
  42 |     await expect(this.layout.getHomeNavLink()).toBeVisible()
  43 |   }
  44 | 
  45 |   @Then('the staff ACTIVITIES link is visible')
  46 |   async verifyActivitiesLink () {
  47 |     await expect(this.layout.getActivitiesNavLink()).toBeVisible()
  48 |   }
  49 | 
  50 |   @Then('the staff main navigation menu is visible')
  51 |   async verifyMainNavigationMenuVisible () {
  52 |     await expect(this.layout.getMainNavigation()).toBeVisible()
  53 |   }
  54 | }
  55 | 
```