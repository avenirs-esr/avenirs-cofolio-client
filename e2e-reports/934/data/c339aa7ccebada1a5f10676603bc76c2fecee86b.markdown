# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/staff/feedbacks/feedbackDetails.feature.spec.js >> Staff Activity Feedback Details Page >> Page Load and Basic Display >> Staff can load activity feedback details page successfully
- Location: .features-gen/tests/staff/feedbacks/feedbackDetails.feature.spec.js:13:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/activity-feedbacks"
Received string:    "http://localhost:4173/cofolio/staff/student-tracking/activity-feedback/feedback-1"

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - link "Accueil - Cofolio Staff" [ref=e12] [cursor=pointer]:
          - /url: /cofolio/staff
          - img [ref=e13]
        - button "Changer d'univers" [ref=e15] [cursor=pointer]:
          - generic [ref=e18]: Changer d'univers
      - generic [ref=e20]:
        - list [ref=e23]:
          - listitem [ref=e24]:
            - button "Notifications (10)" [ref=e27] [cursor=pointer]:
              - generic [ref=e30]: Notifications (10)
          - listitem [ref=e31]:
            - button "M. dupont" [ref=e34] [cursor=pointer]:
              - generic [ref=e37]: M. dupont
        - navigation [ref=e40]:
          - button "FR" [ref=e43] [cursor=pointer]:
            - generic [ref=e46]: FR
    - navigation "Menu principal" [ref=e50]:
      - list [ref=e51]:
        - listitem [ref=e52]:
          - link "ACCUEIL" [ref=e53] [cursor=pointer]:
            - /url: /cofolio/staff
            - generic [ref=e56]: ACCUEIL
        - listitem [ref=e57]:
          - link "BIBLIOTHÈQUE DES ACTIVITÉS" [ref=e58] [cursor=pointer]:
            - /url: /cofolio/staff/activities
            - generic [ref=e61]: BIBLIOTHÈQUE DES ACTIVITÉS
        - listitem [ref=e62]:
          - button "SUIVI DES APPRENANTS" [ref=e63] [cursor=pointer]:
            - generic [ref=e64]: SUIVI DES APPRENANTS
  - main [ref=e65]:
    - generic [ref=e66]:
      - generic [ref=e68]:
        - navigation "Fil d'Ariane" [ref=e69]:
          - list [ref=e71]:
            - listitem [ref=e72]:
              - link "Accueil" [ref=e73] [cursor=pointer]:
                - /url: /cofolio/staff
            - listitem [ref=e74]:
              - generic: Suivi des apprenants
            - listitem [ref=e75]:
              - link "Toutes mes demandes de feedback" [ref=e76] [cursor=pointer]:
                - /url: /cofolio/staff/student-tracking/feedbacks
            - listitem [ref=e77]:
              - generic: Activité de test
        - heading "Toutes mes demandes de feedback (0) sur l'activité \"Activité de test\"" [level=1] [ref=e78]
      - generic [ref=e79]:
        - generic [ref=e84]:
          - combobox [ref=e89] [cursor=pointer]
          - status
        - generic [ref=e92]:
          - generic [ref=e98]: Sa prise de recul
          - button "Réduire" [expanded] [ref=e101] [cursor=pointer]
        - generic [ref=e105]:
          - generic [ref=e106]:
            - text: Récapitulatif des éléments associés (2)
            - button "Collapse card" [expanded] [ref=e109] [cursor=pointer]
          - generic [ref=e114]:
            - generic [ref=e116]:
              - generic [ref=e117]:
                - status [ref=e119]:
                  - generic [ref=e120]: Trace
                - generic [ref=e121]: Développement d'un ePortfolio
              - button "Télécharger" [ref=e123] [cursor=pointer]:
                - generic [ref=e126]: Télécharger
              - button "Expand card" [ref=e129] [cursor=pointer]
            - generic [ref=e133]:
              - generic [ref=e134]:
                - status [ref=e136]:
                  - generic [ref=e137]: Compétence
                - generic [ref=e138]: Ma super compétence complémentaire
              - button "Expand card" [ref=e141] [cursor=pointer]
      - region "Gestion du feedback" [ref=e145]:
        - generic [ref=e146]:
          - generic [ref=e147]:
            - generic [ref=e152]: Gestion du feedback
            - generic [ref=e156]: Activité de test
          - button "Expand panel" [ref=e159] [cursor=pointer]
  - contentinfo [ref=e162]:
    - generic [ref=e164]:
      - generic [ref=e165]:
        - link "Logo ANR" [ref=e166] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e167]
        - link "Logo France 2030" [ref=e168] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e169]
      - generic [ref=e170]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e171]:
      - generic [ref=e172]:
        - img "Logo Cofolio" [ref=e173]
        - generic [ref=e184]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e185]:
        - generic [ref=e186]:
          - generic [ref=e187]: Informations légales
          - list [ref=e188]:
            - listitem [ref=e189]:
              - 'link "Accessibilité : partiellement conforme" [ref=e190] [cursor=pointer]':
                - /url: /cofolio/staff/accessibility
            - listitem [ref=e191]:
              - link "Mentions légales" [ref=e192] [cursor=pointer]:
                - /url: /cofolio/staff/legal
            - listitem [ref=e193]:
              - link "Données personnelles" [ref=e194] [cursor=pointer]:
                - /url: /cofolio/staff/personal-data
            - listitem [ref=e195]:
              - link "Gestion des cookies" [ref=e196] [cursor=pointer]:
                - /url: /cofolio/staff/cookies
        - generic [ref=e197]:
          - generic [ref=e198]: Autres sites
          - list [ref=e199]:
            - listitem [ref=e200]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e201] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e202]:
          - generic [ref=e203]: Partenaires
          - generic [ref=e204]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e205] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e206]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e207] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e209]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e213] [cursor=pointer]:
      - /url: https://www.esup-portail.org/
      - text: "@ESUP-Portail. Tous droits réservés."
```

# Test source

```ts
  1  | import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
  2  | import { expect, type Locator, type Page } from '@playwright/test'
  3  | import { Given, Then, When } from 'playwright-bdd/decorators'
  4  | 
  5  | export abstract class BasePage {
  6  |   protected constructor (public page: Page) {}
  7  | 
  8  |   @Then('no horizontal scrolling is required')
  9  |   async verifyNoHorizontalScroll () {
  10 |     const { scrollWidth, clientWidth } = await this.page.evaluate(() => {
  11 |       const el = document.documentElement
  12 |       return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }
  13 |     })
  14 | 
  15 |     expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  16 |   }
  17 | 
  18 |   async verifyLocatorIsFullWidth (locator: Locator, tolerancePercent = 10) {
  19 |     const viewport = this.page.viewportSize()
  20 |     if (!viewport) {
  21 |       throw new Error('Viewport not available')
  22 |     }
  23 | 
  24 |     const box = await locator.boundingBox()
  25 |     if (!box) {
  26 |       throw new Error('Element not visible')
  27 |     }
  28 | 
  29 |     const tolerancePx = (viewport.width * tolerancePercent) / 100
  30 |     expect(box.width).toBeGreaterThan(viewport.width - tolerancePx)
  31 |   }
  32 | 
  33 |   @Given('the page is displayed on mobile viewport')
  34 |   async verifyMobileViewport () {
  35 |     const viewport = this.page.viewportSize()
  36 |     expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  37 |   }
  38 | 
  39 |   @When('the user scrolls down through the page')
  40 |   async scrollDown () {
  41 |     await this.page.evaluate(() => {
  42 |       window.scrollTo(0, document.body.scrollHeight / 2)
  43 |     })
  44 |     await this.page.waitForTimeout(500)
  45 |   }
  46 | 
  47 |   @Then('the URL contains {string}')
  48 |   async verifyUrlContains (url: string) {
  49 |     await expect.poll(
  50 |       () => this.page.url(),
  51 |       { timeout: 5000 }
> 52 |     ).toContain(url)
     |       ^ Error: expect(received).toContain(expected) // indexOf
  53 |   }
  54 | 
  55 |   @Then('the page title is {string}')
  56 |   async verifyPageTitle (title: string) {
  57 |     await expect(this.page).toHaveTitle(title)
  58 |   }
  59 | }
  60 | 
```