# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Update Profile Drawer >> Student can close the update profile drawer
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js:35:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('update-profile-drawer').locator('.av-drawer').locator('.av-cancel-confirm-buttons-container button').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation "Accès rapide":
      - list [ref=e3]:
        - listitem [ref=e4]:
          - link "Aller au contenu principal" [ref=e5] [cursor=pointer]:
            - /url: "#main"
            - generic [ref=e6]: Aller au contenu principal
        - listitem [ref=e7]:
          - link "Aller au pied de page" [ref=e8] [cursor=pointer]:
            - /url: "#footer"
            - generic [ref=e9]: Aller au pied de page
    - banner [ref=e10]:
      - generic [ref=e15]:
        - link "Accueil - Cofolio Étudiant" [ref=e19] [cursor=pointer]:
          - /url: /cofolio/student
          - img [ref=e20]
        - button "Menu" [ref=e25] [cursor=pointer]
    - main [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e31]:
          - navigation "Fil d'Ariane" [ref=e32]:
            - button "Voir le fil d'Ariane" [ref=e33] [cursor=pointer]:
              - generic [ref=e34]: Voir le fil d'Ariane
          - heading "Bâtir mon projet" [level=1] [ref=e35]
        - generic [ref=e37]:
          - generic [ref=e39]:
            - generic [ref=e40]:
              - generic [ref=e41]: Accéder à
              - combobox "Accéder à" [ref=e44] [cursor=pointer]:
                - option "Bâtir mon projet"
                - option "Me connaître" [selected]
                - option "Explorer mes futurs"
                - option "Mes Trajectoires"
            - status
          - generic [ref=e46]:
            - generic [ref=e52]: Qui je suis ?
            - button "Modifier mon profil" [active] [ref=e54] [cursor=pointer]:
              - generic [ref=e57]: Modifier mon profil
            - generic [ref=e58]:
              - generic [ref=e60]:
                - img "Bannière du profil" [ref=e61]
                - img "Photo de profil" [ref=e63]
              - generic [ref=e66]:
                - generic [ref=e67]: Jeanne Moulin
                - generic [ref=e68]: Je suis étudiante en chimie et écologie. Passionnée par l'innovation durable, je souhaite utiliser la science pour protéger l'environnement et bâtir un avenir plus respectueux de la planète.
            - button "Ajouter une catégorie" [ref=e70] [cursor=pointer]:
              - generic [ref=e73]: Ajouter une catégorie
            - generic [ref=e74]:
              - generic [ref=e75]:
                - generic [ref=e76]:
                  - generic [ref=e77]:
                    - generic [ref=e81]: Mes points forts (10)
                    - button "Plus d'actions" [ref=e85] [cursor=pointer]:
                      - generic [ref=e88]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e91] [cursor=pointer]
                - generic [ref=e95]:
                  - generic [ref=e96]: Identifier et valoriser mes qualités, talents et réussites marquantes.
                  - generic [ref=e98]:
                    - navigation [ref=e99]:
                      - list [ref=e100]:
                        - listitem [ref=e101]: Page 1 sur 4
                        - listitem
                        - listitem [ref=e102]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                        - listitem [ref=e103]:
                          - link "Page suivante" [ref=e106] [cursor=pointer]:
                            - /url: "#page-2"
                        - listitem
                    - generic [ref=e109]:
                      - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes" [ref=e110] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=ee134b29-8d12-4fbd-a40a-6e6b49cb721a
                        - generic [ref=e112]:
                          - generic "Créativité" [ref=e115]
                          - paragraph [ref=e123]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                      - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration" [ref=e124] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=67949aa4-2d80-4543-9766-54410a442c24
                        - generic [ref=e126]:
                          - generic "Esprit d'équipe" [ref=e129]
                          - paragraph [ref=e137]: Je travaille efficacement avec les autres et favorise la collaboration
                      - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs" [ref=e138] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=b6fab575-598e-4b32-9c08-4cbf827d89f3
                        - generic [ref=e140]:
                          - generic "Leadership" [ref=e143]
                          - paragraph [ref=e151]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - generic [ref=e154]:
                    - generic [ref=e158]: Mes valeurs (10)
                    - button "Plus d'actions" [ref=e162] [cursor=pointer]:
                      - generic [ref=e165]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e168] [cursor=pointer]
                - generic [ref=e172]:
                  - generic [ref=e173]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                  - generic [ref=e175]:
                    - navigation [ref=e176]:
                      - list [ref=e177]:
                        - listitem [ref=e178]: Page 1 sur 4
                        - listitem
                        - listitem [ref=e179]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                        - listitem [ref=e180]:
                          - link "Page suivante" [ref=e183] [cursor=pointer]:
                            - /url: "#page-2"
                        - listitem
                    - generic [ref=e186]:
                      - link "Respect Traiter les autres avec considération et dignité ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e187] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=6f8960e1-d7a3-4c19-a892-ad81b1de407d
                        - generic [ref=e189]:
                          - generic "Respect" [ref=e192]
                          - generic [ref=e196]:
                            - paragraph [ref=e200]: Traiter les autres avec considération et dignité
                            - generic [ref=e203]:
                              - generic [ref=e204]: ⭐
                              - generic [ref=e205]: ⭐
                              - generic [ref=e206]: ⭐
                              - generic [ref=e207]: ⭐
                              - generic [ref=e208]: ⭐
                              - generic [ref=e209]: 5/5
                      - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions" [ref=e210] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=b3d9eb4e-1d2d-47e9-8198-81fa6a8aa3c0
                        - generic [ref=e212]:
                          - generic "Honnêteté" [ref=e215]
                          - paragraph [ref=e223]: Agir avec intégrité et transparence dans toutes mes interactions
                      - link "Solidarité Soutenir et aider les autres dans le besoin ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e224] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=0790a919-f140-4592-aca1-6522cfb3d727
                        - generic [ref=e226]:
                          - generic "Solidarité" [ref=e229]
                          - generic [ref=e233]:
                            - paragraph [ref=e237]: Soutenir et aider les autres dans le besoin
                            - generic [ref=e240]:
                              - generic [ref=e241]: ⭐
                              - generic [ref=e242]: ⭐
                              - generic [ref=e243]: ⭐
                              - generic [ref=e244]: ⭐
                              - generic [ref=e245]: 4/5
              - generic [ref=e246]:
                - generic [ref=e247]:
                  - generic [ref=e248]:
                    - generic [ref=e252]: Mes envies (10)
                    - button "Plus d'actions" [ref=e256] [cursor=pointer]:
                      - generic [ref=e259]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e262] [cursor=pointer]
                - generic [ref=e266]:
                  - generic [ref=e267]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                  - generic [ref=e269]:
                    - navigation [ref=e270]:
                      - list [ref=e271]:
                        - listitem [ref=e272]: Page 1 sur 4
                        - listitem
                        - listitem [ref=e273]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                        - listitem [ref=e274]:
                          - link "Page suivante" [ref=e277] [cursor=pointer]:
                            - /url: "#page-2"
                        - listitem
                    - generic [ref=e280]:
                      - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise" [ref=e281] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=a0ce444b-f03b-4845-b21a-2a9bc689ccc0
                        - generic [ref=e283]:
                          - generic "Développer mes compétences techniques" [ref=e286]
                          - paragraph [ref=e294]: Approfondir mes connaissances dans mon domaine d'expertise
                      - link "Manager une équipe Acquérir de l'expérience en gestion et leadership ⭐ ⭐ 2/5" [ref=e295] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=83576dd3-066c-46c3-8b4f-2f1bf8a06e3d
                        - generic [ref=e297]:
                          - generic "Manager une équipe" [ref=e300]
                          - generic [ref=e304]:
                            - paragraph [ref=e308]: Acquérir de l'expérience en gestion et leadership
                            - generic [ref=e311]:
                              - generic [ref=e312]: ⭐
                              - generic [ref=e313]: ⭐
                              - generic [ref=e314]: 2/5
                      - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons" [ref=e315] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=e2bbf52e-cb77-4ca8-9059-bcb64493ab1c
                        - generic [ref=e317]:
                          - generic "Voyager à l'étranger" [ref=e320]
                          - paragraph [ref=e328]: Découvrir de nouvelles cultures et élargir mes horizons
    - contentinfo [ref=e329]:
      - generic [ref=e331]:
        - generic [ref=e332]:
          - link "Logo ANR" [ref=e333] [cursor=pointer]:
            - /url: https://anr.fr/ProjetIA-21-DMAV-0001
            - img "Logo ANR" [ref=e334]
          - link "Logo France 2030" [ref=e335] [cursor=pointer]:
            - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
            - img "Logo France 2030" [ref=e336]
        - generic [ref=e337]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
      - generic [ref=e338]:
        - generic [ref=e339]:
          - img "Logo Cofolio" [ref=e340]
          - generic [ref=e351]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
        - generic [ref=e352]:
          - generic [ref=e353]:
            - generic [ref=e354]: Informations légales
            - list [ref=e355]:
              - listitem [ref=e356]:
                - 'link "Accessibilité : partiellement conforme" [ref=e357] [cursor=pointer]':
                  - /url: /cofolio/student/accessibility
              - listitem [ref=e358]:
                - link "Mentions légales" [ref=e359] [cursor=pointer]:
                  - /url: /cofolio/student/legal
              - listitem [ref=e360]:
                - link "Données personnelles" [ref=e361] [cursor=pointer]:
                  - /url: /cofolio/student/personal-data
              - listitem [ref=e362]:
                - link "Gestion des cookies" [ref=e363] [cursor=pointer]:
                  - /url: /cofolio/student/cookies
          - generic [ref=e364]:
            - generic [ref=e365]: Autres sites
            - list [ref=e366]:
              - listitem [ref=e367]:
                - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e368] [cursor=pointer]:
                  - /url: https://avenirs-esr.fr/
                  - text: avenirs-esr.fr
          - generic [ref=e369]:
            - generic [ref=e370]: Partenaires
            - generic [ref=e371]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e372] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - img "Logo Avenir(s) ESR" [ref=e373]
              - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e374] [cursor=pointer]:
                - /url: https://www.esup-portail.org/
                - img "Logo Esup Portail" [ref=e376]
      - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e380] [cursor=pointer]:
        - /url: https://www.esup-portail.org/
        - text: "@ESUP-Portail. Tous droits réservés."
  - dialog "Menu latéral" [ref=e382]:
    - generic [ref=e383]:
      - generic [ref=e385]:
        - generic [ref=e391]: Modifier mon profil
        - group "Accordion group" [ref=e393]:
          - heading "Identité" [level=3] [ref=e395]:
            - button "Identité" [ref=e396] [cursor=pointer]:
              - generic [ref=e400]: Identité
          - heading "Couverture" [level=3] [ref=e402]:
            - button "Couverture" [ref=e403] [cursor=pointer]:
              - generic [ref=e407]: Couverture
          - heading "Photo de profil" [level=3] [ref=e409]:
            - button "Photo de profil" [ref=e410] [cursor=pointer]:
              - generic [ref=e414]: Photo de profil
      - generic [ref=e417]:
        - button "Quitter" [ref=e418] [cursor=pointer]:
          - generic [ref=e421]: Quitter
        - button "Enregistrer" [disabled] [ref=e422]:
          - generic [ref=e425]: Enregistrer
```

# Test source

```ts
  1   | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2   | import { BasePage } from '@e2e/framework/shared/base/BasePage'
  3   | import { ProfileCard } from '@e2e/framework/shared/componentObjects/ProfileCard'
  4   | import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
  5   | import { t } from '@e2e/framework/shared/utils/i18n'
  6   | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  7   | import { expect, type Page } from '@playwright/test'
  8   | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  9   | 
  10  | export
  11  | @Fixture<typeof test>('studentTrajectoriesSelfKnowledgePage')
  12  | class StudentTrajectoriesSelfKnowledgePage extends BasePage {
  13  |   constructor (public page: Page) {
  14  |     super(page)
  15  |   }
  16  | 
  17  |   getSectionNavigationSideNavigation () {
  18  |     return this.page.getByTestId('section-navigation-side-navigation')
  19  |   }
  20  | 
  21  |   getSectionNavigationSelectNavigation () {
  22  |     return this.page.locator('select[data-testid="section-navigation-select-navigation"]')
  23  |   }
  24  | 
  25  |   getSelfKnowledgeSideNavigationItem () {
  26  |     return this.page.getByTestId('collapsed-menu-SELF_KNOWLEDGE')
  27  |       .or(this.page.getByTestId('expanded-menu-SELF_KNOWLEDGE'))
  28  |   }
  29  | 
  30  |   async navigateToSelfKnowledgeSection () {
  31  |     const sideNavigation = this.getSectionNavigationSideNavigation()
  32  | 
  33  |     if (await sideNavigation.isVisible().catch(() => false)) {
  34  |       await this.getSelfKnowledgeSideNavigationItem().click()
  35  |       return
  36  |     }
  37  | 
  38  |     await this.getSectionNavigationSelectNavigation().selectOption({
  39  |       value: 'SELF_KNOWLEDGE',
  40  |     })
  41  |   }
  42  | 
  43  |   getUpdateProfileDrawer () {
  44  |     return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  45  |   }
  46  | 
  47  |   getDisplayUpdateProfileDrawerButton () {
  48  |     return this.page.getByTestId('display-update-profile-drawer-button')
  49  |   }
  50  | 
  51  |   getProfileCard () {
  52  |     return new ProfileCard(this.page.getByTestId('profile-card'))
  53  |   }
  54  | 
  55  |   getSectionTitle () {
  56  |     return this.page.getByTestId('self-knowledge-section-title')
  57  |   }
  58  | 
  59  |   @Given('the student opens the project self knowledge main section page')
  60  |   async goto () {
  61  |     await this.page.goto(STUDENT_ROUTES.PROJECT.TRAJECTORIES.SELF_KNOWLEDGE)
  62  |     await waitForPageLoad(this.page)
  63  | 
  64  |     await this.navigateToSelfKnowledgeSection()
  65  |     await waitForPageLoad(this.page)
  66  |   }
  67  | 
  68  |   @Then('the student project self knowledge main section page is displayed')
  69  |   async verifyPageLoaded () {
  70  |     await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.TRAJECTORIES.SELF_KNOWLEDGE)
  71  |   }
  72  | 
  73  |   @Then('the self-knowledge section title is displayed')
  74  |   async verifySectionTitle () {
  75  |     await expect(this.getSectionTitle()).toBeVisible()
  76  |     await expect(this.getSectionTitle()).toHaveText(
  77  |       t('student.selfKnowledge.SelfKnowledgeMainSection.title.content'),
  78  |     )
  79  |   }
  80  | 
  81  |   @When('the user clicks the display update profile drawer button')
  82  |   async clickDisplayUpdateProfileDrawerButton () {
  83  |     await this.getDisplayUpdateProfileDrawerButton().click()
  84  |     await waitForPageLoad(this.page)
  85  |   }
  86  | 
  87  |   @Then('the update profile drawer is opened in the project self knowledge main section page')
  88  |   async verifyUpdateProfileDrawerOpened () {
  89  |     await expect(this.getUpdateProfileDrawer()).toBeVisible()
  90  |   }
  91  | 
  92  |   @When('the user clicks the exit button on the update profile drawer')
  93  |   async closeDrawer () {
  94  |     const updateProfileDrawer = this.getUpdateProfileDrawer()
  95  |     const exitButton = updateProfileDrawer.locator('.av-cancel-confirm-buttons-container button').first()
> 96  |     await exitButton.click()
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  97  |   }
  98  | 
  99  |   @Then('the update profile drawer is closed in the project self knowledge main section page')
  100 |   async verifyUpdateProfileDrawerClosed () {
  101 |     await expect(this.getUpdateProfileDrawer()).toBeHidden()
  102 |   }
  103 | 
  104 |   @Then('the self-knowledge profile card is visible')
  105 |   async verifyProfileCardVisible () {
  106 |     await this.getProfileCard().isVisible()
  107 |   }
  108 | 
  109 |   @Then('all profile content is readable on mobile')
  110 |   async verifyProfileCardContent () {
  111 |     await this.getProfileCard().verifyCardContent()
  112 |   }
  113 | 
  114 |   @Then('the self-knowledge profile card banner is visible')
  115 |   async verifyProfileCardBannerVisible () {
  116 |     await this.getProfileCard().verifyProfileBanner()
  117 |   }
  118 | 
  119 |   @Then('the self-knowledge profile card picture is visible')
  120 |   async verifyProfileCardPictureVisible () {
  121 |     await this.getProfileCard().verifyProfilePicture()
  122 |   }
  123 | 
  124 |   @Then('the self-knowledge profile card name is visible')
  125 |   async verifyProfileCardNameVisible () {
  126 |     await this.getProfileCard().verifyFullName()
  127 |   }
  128 | 
  129 |   @Then('the self-knowledge profile card bio is visible')
  130 |   async verifyProfileCardBioVisible () {
  131 |     await this.getProfileCard().verifyBio()
  132 |   }
  133 | 
  134 |   @Then('the profile card spans full width')
  135 |   async verifyProfileCardFullWidth () {
  136 |     await this.verifyLocatorIsFullWidth(this.getProfileCard().getRoot())
  137 |   }
  138 | 
  139 |   @Then('the update profile drawer card spans full width')
  140 |   async verifyUpdateProfileDrawerFullWidth () {
  141 |     await this.verifyLocatorIsFullWidth(this.getUpdateProfileDrawer())
  142 |   }
  143 | }
  144 | 
```