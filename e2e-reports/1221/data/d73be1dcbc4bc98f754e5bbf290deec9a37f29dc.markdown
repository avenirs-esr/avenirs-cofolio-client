# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/activitiesCatalog/activitiesCatalog.mobile.feature.spec.js >> Student Project Activities Catalog Page >> Activities Navigation - Mobile >> Student sees first thematic activities in select navigation
- Location: .features-gen/tests/student/lifeProject/activitiesCatalog/activitiesCatalog.mobile.feature.spec.js:31:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('select[data-testid="activities-select-navigation"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('select[data-testid="activities-select-navigation"]')
    - waiting for" http://localhost:4173/cofolio/student/activities/catalog/SELF_KNOWLEDGE/9a12e6b4-8c3f-4d22-bf55-6d4c1f2a7e33" navigation to finish...
    - navigated to "http://localhost:4173/cofolio/student/activities/catalog/SELF_KNOWLEDGE/9a12e6b4-8c3f-4d22-bf55-6d4c1f2a7e33"

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
  - link "Accueil - Cofolio Étudiant":
    - /url: /cofolio/student
    - img
  - button "Menu"
  - button "Changer d'univers"
- main:
  - navigation "Fil d'Ariane":
    - button "Voir le fil d'Ariane"
  - heading "Toutes les activités disponibles" [level=1]
  - text: Accéder à
  - button "Identifier ses motivations profondes"
  - status
  - link "Précédent":
    - /url: /cofolio/student/activities/catalog/OTHER/d6b1e9c5-8f2a-4a77-9c3e-1d7b5f2a6e88
  - link "Suivant":
    - /url: /cofolio/student/activities/catalog/SELF_KNOWLEDGE/3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1
  - img "Image de l'activité Connaissance de soi - Définir ses valeurs"
  - text: "Activité “Connaissance de soi” : Définir ses valeurs"
  - status: Me connaître
  - text: Extrait de l'activité Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l'étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s'incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie. Contexte(s) de réalisation conseillé(s) - À réaliser en amont d'un entretien avec un.e conseiller/conseillère ou chargé.e d'orientation et/ou d'insertion professionnelle - avant une autre activité si parcours d'activités Cofolio
  - button "M'inscrire à l'activité"
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
  1   | import type { Locator, Page } from '@playwright/test'
  2   | import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
  3   | import { expect } from '@playwright/test'
  4   | 
  5   | export class ActivitiesSelectNavigation extends BaseObject {
  6   |   private static readonly SELECT_TESTID = 'activities-select-navigation'
  7   |   private static readonly OPTGROUP_PREFIX = 'select-optgroup-'
  8   |   private static readonly EXPECTED_ENABLED_OPTIONS = 32
  9   | 
  10  |   constructor (protected page: Page) {
  11  |     super(page.locator(`select[data-testid="${ActivitiesSelectNavigation.SELECT_TESTID}"]`), page)
  12  |   }
  13  | 
  14  |   private select (): Locator {
  15  |     return this.root
  16  |   }
  17  | 
  18  |   private enabledOptions (): Locator {
  19  |     return this.select().locator('option:not([disabled])')
  20  |   }
  21  | 
  22  |   private optgroups (): Locator {
  23  |     return this.select().locator(`[data-testid^="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}"]`)
  24  |   }
  25  | 
  26  |   private optgroup (thematic: string): Locator {
  27  |     return this.select().locator(`[data-testid="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${thematic}"]`)
  28  |   }
  29  | 
  30  |   private enabledOptionsInThematic (thematic: string): Locator {
  31  |     return this.optgroup(thematic).locator('option:not([disabled])')
  32  |   }
  33  | 
  34  |   private firstOptgroup (): Locator {
  35  |     return this.optgroups().first()
  36  |   }
  37  | 
  38  |   private async readOptionLabel (option: Locator): Promise<string> {
  39  |     const text = (await option.textContent())?.trim()
  40  |     return text ?? ''
  41  |   }
  42  | 
  43  |   async verifyVisible () {
  44  |     await expect(this.select()).toBeVisible()
  45  |   }
  46  | 
  47  |   async verifyHidden () {
  48  |     await expect(this.select()).toBeHidden()
  49  |   }
  50  | 
  51  |   async verifyHasThematics () {
  52  |     await expect(this.enabledOptions()).toHaveCount(ActivitiesSelectNavigation.EXPECTED_ENABLED_OPTIONS)
  53  |   }
  54  | 
  55  |   async verifyFirstThematicIs (expected: string) {
> 56  |     await expect(this.select()).toBeVisible()
      |                                 ^ Error: expect(locator).toBeVisible() failed
  57  | 
  58  |     const first = this.firstOptgroup()
  59  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  60  |     await expect(first).toHaveAttribute(
  61  |       'data-testid',
  62  |       `${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${expected}`,
  63  |     )
  64  |   }
  65  | 
  66  |   async verifyFirstThematicHasAtLeastOneActivity () {
  67  |     await expect(this.select()).toBeVisible()
  68  | 
  69  |     const first = this.firstOptgroup()
  70  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  71  | 
  72  |     const options = first.locator('option:not([disabled])')
  73  |     const count = await options.count()
  74  |     expect(count, 'Expected at least 1 enabled option in first optgroup').toBeGreaterThan(0)
  75  |   }
  76  | 
  77  |   async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
  78  |     await expect(this.select()).toBeVisible()
  79  | 
  80  |     const first = this.firstOptgroup()
  81  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  82  | 
  83  |     const firstOption = first.locator('option:not([disabled])').first()
  84  |     await expect(firstOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)
  85  | 
  86  |     const label = await this.readOptionLabel(firstOption)
  87  |     expect(label, 'First activity label mismatch in first optgroup').toContain(expectedTitle)
  88  |   }
  89  | 
  90  |   async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
  91  |     await expect(this.select()).toBeVisible()
  92  | 
  93  |     const first = this.firstOptgroup()
  94  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  95  | 
  96  |     const lastOption = first.locator('option:not([disabled])').last()
  97  |     await expect(lastOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)
  98  | 
  99  |     const label = await this.readOptionLabel(lastOption)
  100 |     expect(label, 'Last activity label mismatch in first optgroup').toContain(expectedTitle)
  101 |   }
  102 | 
  103 |   async selectSecondActivityOfThematic (thematic: string) {
  104 |     const select = this.select()
  105 |     await expect(select).toBeVisible()
  106 | 
  107 |     const group = this.optgroup(thematic)
  108 |     await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)
  109 | 
  110 |     const options = this.enabledOptionsInThematic(thematic)
  111 |     const count = await options.count()
  112 |     expect(
  113 |       count,
  114 |       `Thematic ${thematic} should have at least 2 activities to select the second one`,
  115 |     ).toBeGreaterThanOrEqual(2)
  116 | 
  117 |     const value = await options.nth(1).getAttribute('value')
  118 |     expect(value, `Second option in thematic ${thematic} should have a value`).toBeTruthy()
  119 | 
  120 |     await select.selectOption(value!)
  121 |   }
  122 | 
  123 |   async verifyAllExpectedThematics (expected: string[]) {
  124 |     await expect(this.select()).toBeVisible()
  125 | 
  126 |     for (const thematic of expected) {
  127 |       const group = this.optgroup(thematic)
  128 |       await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)
  129 | 
  130 |       const enabledCount = await group.locator('option:not([disabled])').count()
  131 |       expect(enabledCount, `Thematic ${thematic} should have at least 1 enabled activity`).toBeGreaterThan(0)
  132 |     }
  133 |   }
  134 | }
  135 | 
```