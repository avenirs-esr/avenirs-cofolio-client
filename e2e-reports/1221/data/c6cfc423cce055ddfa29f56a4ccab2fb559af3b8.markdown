# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Update Profile Drawer >> Student can close the update profile drawer
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js:35:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select[data-testid="section-navigation-select-navigation"]')

```

# Page snapshot

```yaml
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
    - generic [ref=e14]:
      - generic [ref=e15]:
        - link "Accueil - Cofolio Étudiant" [ref=e19] [cursor=pointer]:
          - /url: /cofolio/student
          - img [ref=e20]
        - button "Menu" [ref=e25] [cursor=pointer]
      - button "Changer d'univers" [ref=e28] [cursor=pointer]:
        - generic [ref=e31]: Changer d'univers
  - main [ref=e32]:
    - generic [ref=e33]:
      - generic [ref=e35]:
        - navigation "Fil d'Ariane" [ref=e36]:
          - button "Voir le fil d'Ariane" [ref=e37] [cursor=pointer]:
            - generic [ref=e38]: Voir le fil d'Ariane
        - heading "Bâtir mon projet" [level=1] [ref=e41]
      - generic [ref=e43]:
        - generic [ref=e44]:
          - generic [ref=e45]: Accéder à
          - button "Me connaître" [ref=e46] [cursor=pointer]:
            - generic [ref=e47]: Me connaître
        - status
        - generic [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e54]: Me connaître
            - button "Modifier mon profil" [ref=e56] [cursor=pointer]:
              - generic [ref=e59]: Modifier mon profil
          - generic [ref=e60]:
            - generic [ref=e62]:
              - img "Bannière du profil" [ref=e63]
              - img "Photo de profil" [ref=e65]
            - generic [ref=e68]:
              - generic [ref=e69]: Jeanne Moulin
              - generic [ref=e70]: Je suis étudiante en chimie et écologie. Passionnée par l'innovation durable, je souhaite utiliser la science pour protéger l'environnement et bâtir un avenir plus respectueux de la planète.
          - button "Gérer mes catégories" [ref=e74] [cursor=pointer]:
            - generic [ref=e77]: Gérer mes catégories
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - generic [ref=e85]: Mes points forts (10)
                  - button "Gérer mes éléments" [ref=e89] [cursor=pointer]:
                    - generic [ref=e92]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e95] [cursor=pointer]
              - generic [ref=e99]:
                - generic [ref=e100]: Identifier et valoriser mes qualités, talents et réussites marquantes.
                - generic [ref=e102]:
                  - navigation [ref=e103]:
                    - list [ref=e104]:
                      - listitem [ref=e105]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e106]:
                        - generic [ref=e108]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e109]:
                        - link "Page suivante" [ref=e112] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e115]:
                    - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes" [ref=e116] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=351b777f-5253-40b9-8735-0bbe4490804a
                      - generic [ref=e118]:
                        - generic [ref=e121]: Créativité
                        - generic [ref=e129]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                    - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration" [ref=e130] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=2565ddaa-a31f-4e7e-a5a8-fcdf22f61865
                      - generic [ref=e132]:
                        - generic [ref=e135]: Esprit d'équipe
                        - generic [ref=e143]: Je travaille efficacement avec les autres et favorise la collaboration
                    - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs ⭐ ⭐ 2/5" [ref=e144] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=ff0877c7-e569-41b7-b900-e4cfa057cb25
                      - generic [ref=e146]:
                        - generic [ref=e149]: Leadership
                        - generic [ref=e153]:
                          - generic [ref=e157]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                          - generic [ref=e160]:
                            - generic [ref=e161]: ⭐
                            - generic [ref=e162]: ⭐
                            - generic [ref=e163]: 2/5
                    - link "Persévérance Je continue mes efforts même face aux difficultés ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e164] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=d75d6a22-7c9c-40a2-b905-db517817fe4f
                      - generic [ref=e166]:
                        - generic [ref=e169]: Persévérance
                        - generic [ref=e173]:
                          - generic [ref=e177]: Je continue mes efforts même face aux difficultés
                          - generic [ref=e180]:
                            - generic [ref=e181]: ⭐
                            - generic [ref=e182]: ⭐
                            - generic [ref=e183]: ⭐
                            - generic [ref=e184]: ⭐
                            - generic [ref=e185]: ⭐
                            - generic [ref=e186]: 5/5
                    - link "Communication Je m'exprime clairement et j'écoute activement les autres" [ref=e187] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=ad8eac98-1f79-424f-ad5a-74b4921e4354
                      - generic [ref=e189]:
                        - generic [ref=e192]: Communication
                        - generic [ref=e200]: Je m'exprime clairement et j'écoute activement les autres
                    - link "Adaptabilité Je m'ajuste facilement aux changements et aux nouvelles situations" [ref=e201] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=16e25344-ff42-4a57-a261-1f0d197c6440
                      - generic [ref=e203]:
                        - generic [ref=e206]: Adaptabilité
                        - generic [ref=e214]: Je m'ajuste facilement aux changements et aux nouvelles situations
            - generic [ref=e215]:
              - generic [ref=e216]:
                - generic [ref=e217]:
                  - generic [ref=e221]: Mes valeurs (10)
                  - button "Gérer mes éléments" [ref=e225] [cursor=pointer]:
                    - generic [ref=e228]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e231] [cursor=pointer]
              - generic [ref=e235]:
                - generic [ref=e236]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                - generic [ref=e238]:
                  - navigation [ref=e239]:
                    - list [ref=e240]:
                      - listitem [ref=e241]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e242]:
                        - generic [ref=e244]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e245]:
                        - link "Page suivante" [ref=e248] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e251]:
                    - link "Respect Traiter les autres avec considération et dignité ⭐ ⭐ 2/5" [ref=e252] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=6e2edc07-35d5-452c-9c48-30ac4b0d1307
                      - generic [ref=e254]:
                        - generic [ref=e257]: Respect
                        - generic [ref=e261]:
                          - generic [ref=e265]: Traiter les autres avec considération et dignité
                          - generic [ref=e268]:
                            - generic [ref=e269]: ⭐
                            - generic [ref=e270]: ⭐
                            - generic [ref=e271]: 2/5
                    - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions" [ref=e272] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=def3bd88-acca-4882-8d22-a560dc996180
                      - generic [ref=e274]:
                        - generic [ref=e277]: Honnêteté
                        - generic [ref=e285]: Agir avec intégrité et transparence dans toutes mes interactions
                    - link "Solidarité Soutenir et aider les autres dans le besoin" [ref=e286] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=20ec74c5-2bc4-4aa0-8f49-f919d0fd80ea
                      - generic [ref=e288]:
                        - generic [ref=e291]: Solidarité
                        - generic [ref=e299]: Soutenir et aider les autres dans le besoin
                    - link "Justice Promouvoir l'équité et l'égalité des chances pour tous" [ref=e300] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=e697ad49-67b0-405f-9a04-303101232441
                      - generic [ref=e302]:
                        - generic [ref=e305]: Justice
                        - generic [ref=e313]: Promouvoir l'équité et l'égalité des chances pour tous
                    - link "Liberté Respecter l'autonomie et les choix de chacun" [ref=e314] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=b53e8f9d-7fb6-4f2c-8477-4b8fffd07d6f
                      - generic [ref=e316]:
                        - generic [ref=e319]: Liberté
                        - generic [ref=e327]: Respecter l'autonomie et les choix de chacun
                    - link "Engagement M'investir pleinement dans mes projets et responsabilités" [ref=e328] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=c95144e1-1ce1-4d14-9619-750da02f012d
                      - generic [ref=e330]:
                        - generic [ref=e333]: Engagement
                        - generic [ref=e341]: M'investir pleinement dans mes projets et responsabilités
            - generic [ref=e342]:
              - generic [ref=e343]:
                - generic [ref=e344]:
                  - generic [ref=e348]: Mes envies (10)
                  - button "Gérer mes éléments" [ref=e352] [cursor=pointer]:
                    - generic [ref=e355]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e358] [cursor=pointer]
              - generic [ref=e362]:
                - generic [ref=e363]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                - generic [ref=e365]:
                  - navigation [ref=e366]:
                    - list [ref=e367]:
                      - listitem [ref=e368]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e369]:
                        - generic [ref=e371]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e372]:
                        - link "Page suivante" [ref=e375] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e378]:
                    - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise ⭐ ⭐ 2/5" [ref=e379] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=02c221a9-9493-40a5-9d23-87f4132276c2
                      - generic [ref=e381]:
                        - generic [ref=e384]: Développer mes compétences techniques
                        - generic [ref=e388]:
                          - generic [ref=e392]: Approfondir mes connaissances dans mon domaine d'expertise
                          - generic [ref=e395]:
                            - generic [ref=e396]: ⭐
                            - generic [ref=e397]: ⭐
                            - generic [ref=e398]: 2/5
                    - link "Manager une équipe Acquérir de l'expérience en gestion et leadership ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e399] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=4b0fc8ac-8dc0-4fa3-b9b6-4b5fea897030
                      - generic [ref=e401]:
                        - generic [ref=e404]: Manager une équipe
                        - generic [ref=e408]:
                          - generic [ref=e412]: Acquérir de l'expérience en gestion et leadership
                          - generic [ref=e415]:
                            - generic [ref=e416]: ⭐
                            - generic [ref=e417]: ⭐
                            - generic [ref=e418]: ⭐
                            - generic [ref=e419]: ⭐
                            - generic [ref=e420]: 4/5
                    - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons ⭐ 1/5" [ref=e421] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=8589d3d0-36d8-40ac-9f85-5e8dbcc77baa
                      - generic [ref=e423]:
                        - generic [ref=e426]: Voyager à l'étranger
                        - generic [ref=e430]:
                          - generic [ref=e434]: Découvrir de nouvelles cultures et élargir mes horizons
                          - generic [ref=e437]:
                            - generic [ref=e438]: ⭐
                            - generic [ref=e439]: 1/5
                    - link "Créer mon entreprise Développer un projet entrepreneurial qui me passionne" [ref=e440] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=0d2b81aa-10e8-46bf-93c8-840bd1ed08a4
                      - generic [ref=e442]:
                        - generic [ref=e445]: Créer mon entreprise
                        - generic [ref=e453]: Développer un projet entrepreneurial qui me passionne
                    - link "Continuer mes études Poursuivre ma formation académique dans un domaine qui m'intéresse ⭐ 1/5" [ref=e454] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=335f9cf4-1b28-457c-8e65-bcbb3ee42f44
                      - generic [ref=e456]:
                        - generic [ref=e459]: Continuer mes études
                        - generic [ref=e463]:
                          - generic [ref=e467]: Poursuivre ma formation académique dans un domaine qui m'intéresse
                          - generic [ref=e470]:
                            - generic [ref=e471]: ⭐
                            - generic [ref=e472]: 1/5
                    - link "Contribuer à des projets sociaux M'engager dans des initiatives à impact positif ⭐ 1/5" [ref=e473] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=bcfd7294-6d62-420a-9f59-8865f7fd7358
                      - generic [ref=e475]:
                        - generic [ref=e478]: Contribuer à des projets sociaux
                        - generic [ref=e482]:
                          - generic [ref=e486]: M'engager dans des initiatives à impact positif
                          - generic [ref=e489]:
                            - generic [ref=e490]: ⭐
                            - generic [ref=e491]: 1/5
  - contentinfo [ref=e492]:
    - generic [ref=e494]:
      - generic [ref=e495]:
        - link "Logo ANR" [ref=e496] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e497]
        - link "Logo France 2030" [ref=e498] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e499]
      - generic [ref=e500]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e501]:
      - generic [ref=e502]:
        - img "Logo Cofolio" [ref=e503]
        - generic [ref=e514]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e515]:
        - generic [ref=e516]:
          - generic [ref=e517]: Informations légales
          - list [ref=e518]:
            - listitem [ref=e519]:
              - 'link "Accessibilité : partiellement conforme" [ref=e520] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e521]:
              - link "Conditions générales d'utilisation" [ref=e522] [cursor=pointer]:
                - /url: /cofolio/student/cgu
            - listitem [ref=e523]:
              - link "Données personnelles" [ref=e524] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e525]:
              - link "Gestion des cookies" [ref=e526] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e527]:
          - generic [ref=e528]: Autres sites
          - list [ref=e529]:
            - listitem [ref=e530]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e531] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e532]:
          - generic [ref=e533]: Partenaires
          - generic [ref=e534]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e535] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e536]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e537] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e539]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e543] [cursor=pointer]:
      - /url: https://www.esup-portail.org/
      - text: "@ESUP-Portail. Tous droits réservés."
```

# Test source

```ts
  1   | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2   | import type { Page } from '@playwright/test'
  3   | import { BasePage } from '@e2e/framework/shared/base/BasePage'
  4   | import { ProfileCard } from '@e2e/framework/shared/componentObjects/ProfileCard'
  5   | import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
  6   | import { t } from '@e2e/framework/shared/utils/i18n'
  7   | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  8   | import { expect } from '@playwright/test'
  9   | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  10  | 
  11  | export
  12  | @Fixture<typeof test>('studentBuildProjectSelfKnowledgePage')
  13  | class StudentBuildProjectSelfKnowledgePage extends BasePage {
  14  |   constructor (public page: Page) {
  15  |     super(page)
  16  |   }
  17  | 
  18  |   getSectionNavigationSideNavigation () {
  19  |     return this.page.getByTestId('section-navigation-side-navigation')
  20  |   }
  21  | 
  22  |   getSectionNavigationSelectNavigation () {
  23  |     return this.page.locator('select[data-testid="section-navigation-select-navigation"]')
  24  |   }
  25  | 
  26  |   getSelfKnowledgeSideNavigationItem () {
  27  |     return this.page.getByTestId('collapsed-menu-SELF_KNOWLEDGE')
  28  |       .or(this.page.getByTestId('expanded-menu-SELF_KNOWLEDGE'))
  29  |   }
  30  | 
  31  |   async navigateToSelfKnowledgeSection () {
  32  |     const sideNavigation = this.getSectionNavigationSideNavigation()
  33  | 
  34  |     if (await sideNavigation.isVisible().catch(() => false)) {
  35  |       await this.getSelfKnowledgeSideNavigationItem().click()
  36  |       return
  37  |     }
  38  | 
> 39  |     await this.getSectionNavigationSelectNavigation().selectOption({
      |                                                       ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  40  |       value: 'SELF_KNOWLEDGE',
  41  |     })
  42  |   }
  43  | 
  44  |   getUpdateProfileDrawer () {
  45  |     return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  46  |   }
  47  | 
  48  |   getDisplayUpdateProfileDrawerButton () {
  49  |     return this.page.getByTestId('display-update-profile-drawer-button')
  50  |   }
  51  | 
  52  |   getProfileCard () {
  53  |     return new ProfileCard(this.page.getByTestId('profile-card'))
  54  |   }
  55  | 
  56  |   getSectionTitle () {
  57  |     return this.page.getByTestId('self-knowledge-section-title')
  58  |   }
  59  | 
  60  |   @Given('the student opens the project self knowledge main section page')
  61  |   async goto () {
  62  |     await this.page.goto(STUDENT_ROUTES.PROJECT.BUILD_PROJECT.SELF_KNOWLEDGE)
  63  |     await waitForPageLoad(this.page)
  64  | 
  65  |     await this.navigateToSelfKnowledgeSection()
  66  |     await waitForPageLoad(this.page)
  67  |   }
  68  | 
  69  |   @Then('the student project self knowledge main section page is displayed')
  70  |   async verifyPageLoaded () {
  71  |     await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.BUILD_PROJECT.SELF_KNOWLEDGE)
  72  |   }
  73  | 
  74  |   @Then('the self-knowledge section title is displayed')
  75  |   async verifySectionTitle () {
  76  |     await expect(this.getSectionTitle()).toBeVisible()
  77  |     await expect(this.getSectionTitle()).toHaveText(
  78  |       t('student.selfKnowledge.SelfKnowledgeMainSection.title'),
  79  |     )
  80  |   }
  81  | 
  82  |   @When('the user clicks the display update profile drawer button')
  83  |   async clickDisplayUpdateProfileDrawerButton () {
  84  |     await this.getDisplayUpdateProfileDrawerButton().click()
  85  |     await waitForPageLoad(this.page)
  86  |   }
  87  | 
  88  |   @Then('the update profile drawer is opened in the project self knowledge main section page')
  89  |   async verifyUpdateProfileDrawerOpened () {
  90  |     await expect(this.getUpdateProfileDrawer()).toBeVisible()
  91  |   }
  92  | 
  93  |   @When('the user clicks the exit button on the update profile drawer')
  94  |   async closeDrawer () {
  95  |     const updateProfileDrawer = this.getUpdateProfileDrawer()
  96  |     const exitButton = updateProfileDrawer.locator('.av-cancel-confirm-buttons-container button').first()
  97  |     await exitButton.click()
  98  |   }
  99  | 
  100 |   @Then('the update profile drawer is closed in the project self knowledge main section page')
  101 |   async verifyUpdateProfileDrawerClosed () {
  102 |     await expect(this.getUpdateProfileDrawer()).toBeHidden()
  103 |   }
  104 | 
  105 |   @Then('the self-knowledge profile card is visible')
  106 |   async verifyProfileCardVisible () {
  107 |     await this.getProfileCard().isVisible()
  108 |   }
  109 | 
  110 |   @Then('all profile content is readable on mobile')
  111 |   async verifyProfileCardContent () {
  112 |     await this.getProfileCard().verifyCardContent()
  113 |   }
  114 | 
  115 |   @Then('the self-knowledge profile card banner is visible')
  116 |   async verifyProfileCardBannerVisible () {
  117 |     await this.getProfileCard().verifyProfileBanner()
  118 |   }
  119 | 
  120 |   @Then('the self-knowledge profile card picture is visible')
  121 |   async verifyProfileCardPictureVisible () {
  122 |     await this.getProfileCard().verifyProfilePicture()
  123 |   }
  124 | 
  125 |   @Then('the self-knowledge profile card name is visible')
  126 |   async verifyProfileCardNameVisible () {
  127 |     await this.getProfileCard().verifyFullName()
  128 |   }
  129 | 
  130 |   @Then('the self-knowledge profile card bio is visible')
  131 |   async verifyProfileCardBioVisible () {
  132 |     await this.getProfileCard().verifyBio()
  133 |   }
  134 | 
  135 |   @Then('the profile card spans full width')
  136 |   async verifyProfileCardFullWidth () {
  137 |     await this.verifyLocatorIsFullWidth(this.getProfileCard().getRoot())
  138 |   }
  139 | 
```