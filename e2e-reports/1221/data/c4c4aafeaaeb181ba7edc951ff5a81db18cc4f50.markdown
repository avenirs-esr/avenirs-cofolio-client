# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Responsive Behavior >> Profile card displays correctly on mobile viewport
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js:16:5

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
                    - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e116] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=6b45515c-90a5-4059-b931-4138f3dfbeac
                      - generic [ref=e118]:
                        - generic [ref=e121]: Créativité
                        - generic [ref=e125]:
                          - generic [ref=e129]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                          - generic [ref=e132]:
                            - generic [ref=e133]: ⭐
                            - generic [ref=e134]: ⭐
                            - generic [ref=e135]: ⭐
                            - generic [ref=e136]: ⭐
                            - generic [ref=e137]: ⭐
                            - generic [ref=e138]: 5/5
                    - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration" [ref=e139] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=eff62f02-1667-4ea3-aa45-fbccc6ff491b
                      - generic [ref=e141]:
                        - generic [ref=e144]: Esprit d'équipe
                        - generic [ref=e152]: Je travaille efficacement avec les autres et favorise la collaboration
                    - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs ⭐ ⭐ 2/5" [ref=e153] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=0c27d300-01e7-43a1-bf4b-ddd9667a8f37
                      - generic [ref=e155]:
                        - generic [ref=e158]: Leadership
                        - generic [ref=e162]:
                          - generic [ref=e166]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                          - generic [ref=e169]:
                            - generic [ref=e170]: ⭐
                            - generic [ref=e171]: ⭐
                            - generic [ref=e172]: 2/5
                    - link "Persévérance Je continue mes efforts même face aux difficultés" [ref=e173] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=148de72c-54e1-4702-a77e-750ba1c358d7
                      - generic [ref=e175]:
                        - generic [ref=e178]: Persévérance
                        - generic [ref=e186]: Je continue mes efforts même face aux difficultés
                    - link "Communication Je m'exprime clairement et j'écoute activement les autres ⭐ ⭐ ⭐ 3/5" [ref=e187] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=3843f43c-ead5-4f5e-85ee-ad3581955a2a
                      - generic [ref=e189]:
                        - generic [ref=e192]: Communication
                        - generic [ref=e196]:
                          - generic [ref=e200]: Je m'exprime clairement et j'écoute activement les autres
                          - generic [ref=e203]:
                            - generic [ref=e204]: ⭐
                            - generic [ref=e205]: ⭐
                            - generic [ref=e206]: ⭐
                            - generic [ref=e207]: 3/5
                    - link "Adaptabilité Je m'ajuste facilement aux changements et aux nouvelles situations" [ref=e208] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=e6cb59e1-eabb-46d9-9d0b-9b524d55c4a7
                      - generic [ref=e210]:
                        - generic [ref=e213]: Adaptabilité
                        - generic [ref=e221]: Je m'ajuste facilement aux changements et aux nouvelles situations
            - generic [ref=e222]:
              - generic [ref=e223]:
                - generic [ref=e224]:
                  - generic [ref=e228]: Mes valeurs (10)
                  - button "Gérer mes éléments" [ref=e232] [cursor=pointer]:
                    - generic [ref=e235]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e238] [cursor=pointer]
              - generic [ref=e242]:
                - generic [ref=e243]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                - generic [ref=e245]:
                  - navigation [ref=e246]:
                    - list [ref=e247]:
                      - listitem [ref=e248]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e249]:
                        - generic [ref=e251]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e252]:
                        - link "Page suivante" [ref=e255] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e258]:
                    - link "Respect Traiter les autres avec considération et dignité ⭐ 1/5" [ref=e259] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=fa21cb03-ea2f-48ee-85b5-575b433b325c
                      - generic [ref=e261]:
                        - generic [ref=e264]: Respect
                        - generic [ref=e268]:
                          - generic [ref=e272]: Traiter les autres avec considération et dignité
                          - generic [ref=e275]:
                            - generic [ref=e276]: ⭐
                            - generic [ref=e277]: 1/5
                    - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions" [ref=e278] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=025e4e47-5d51-4492-87a0-8a70c783954e
                      - generic [ref=e280]:
                        - generic [ref=e283]: Honnêteté
                        - generic [ref=e291]: Agir avec intégrité et transparence dans toutes mes interactions
                    - link "Solidarité Soutenir et aider les autres dans le besoin ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e292] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=54c55e3a-f051-42cf-afa7-b6abe36dac1f
                      - generic [ref=e294]:
                        - generic [ref=e297]: Solidarité
                        - generic [ref=e301]:
                          - generic [ref=e305]: Soutenir et aider les autres dans le besoin
                          - generic [ref=e308]:
                            - generic [ref=e309]: ⭐
                            - generic [ref=e310]: ⭐
                            - generic [ref=e311]: ⭐
                            - generic [ref=e312]: ⭐
                            - generic [ref=e313]: 4/5
                    - link "Justice Promouvoir l'équité et l'égalité des chances pour tous" [ref=e314] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=7aae21c3-c7ed-482d-82a1-e38531aa94c7
                      - generic [ref=e316]:
                        - generic [ref=e319]: Justice
                        - generic [ref=e327]: Promouvoir l'équité et l'égalité des chances pour tous
                    - link "Liberté Respecter l'autonomie et les choix de chacun" [ref=e328] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=0313905e-f781-4af7-9c18-2f6d9b4b03c3
                      - generic [ref=e330]:
                        - generic [ref=e333]: Liberté
                        - generic [ref=e341]: Respecter l'autonomie et les choix de chacun
                    - link "Engagement M'investir pleinement dans mes projets et responsabilités" [ref=e342] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=8b0e41d0-404a-4d72-8735-904b75599307
                      - generic [ref=e344]:
                        - generic [ref=e347]: Engagement
                        - generic [ref=e355]: M'investir pleinement dans mes projets et responsabilités
            - generic [ref=e356]:
              - generic [ref=e357]:
                - generic [ref=e358]:
                  - generic [ref=e362]: Mes envies (10)
                  - button "Gérer mes éléments" [ref=e366] [cursor=pointer]:
                    - generic [ref=e369]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e372] [cursor=pointer]
              - generic [ref=e376]:
                - generic [ref=e377]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                - generic [ref=e379]:
                  - navigation [ref=e380]:
                    - list [ref=e381]:
                      - listitem [ref=e382]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e383]:
                        - generic [ref=e385]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e386]:
                        - link "Page suivante" [ref=e389] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e392]:
                    - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise" [ref=e393] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=34dd5e93-42b2-43a2-a1dd-8c981ab239fc
                      - generic [ref=e395]:
                        - generic [ref=e398]: Développer mes compétences techniques
                        - generic [ref=e406]: Approfondir mes connaissances dans mon domaine d'expertise
                    - link "Manager une équipe Acquérir de l'expérience en gestion et leadership ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e407] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=547c99c3-abf9-4547-afef-4f293b32bc1f
                      - generic [ref=e409]:
                        - generic [ref=e412]: Manager une équipe
                        - generic [ref=e416]:
                          - generic [ref=e420]: Acquérir de l'expérience en gestion et leadership
                          - generic [ref=e423]:
                            - generic [ref=e424]: ⭐
                            - generic [ref=e425]: ⭐
                            - generic [ref=e426]: ⭐
                            - generic [ref=e427]: ⭐
                            - generic [ref=e428]: ⭐
                            - generic [ref=e429]: 5/5
                    - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons" [ref=e430] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=258c42b0-2289-41f3-91ac-304a293bd715
                      - generic [ref=e432]:
                        - generic [ref=e435]: Voyager à l'étranger
                        - generic [ref=e443]: Découvrir de nouvelles cultures et élargir mes horizons
                    - link "Créer mon entreprise Développer un projet entrepreneurial qui me passionne" [ref=e444] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=dc8b44da-343a-4619-b9b8-4a719a0ff4d6
                      - generic [ref=e446]:
                        - generic [ref=e449]: Créer mon entreprise
                        - generic [ref=e457]: Développer un projet entrepreneurial qui me passionne
                    - link "Continuer mes études Poursuivre ma formation académique dans un domaine qui m'intéresse" [ref=e458] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=08995514-588d-4f40-8a82-c70392e615bd
                      - generic [ref=e460]:
                        - generic [ref=e463]: Continuer mes études
                        - generic [ref=e471]: Poursuivre ma formation académique dans un domaine qui m'intéresse
                    - link "Contribuer à des projets sociaux M'engager dans des initiatives à impact positif ⭐ ⭐ ⭐ 3/5" [ref=e472] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=72630bf0-4eaa-467e-8fef-31cac49099b6
                      - generic [ref=e474]:
                        - generic [ref=e477]: Contribuer à des projets sociaux
                        - generic [ref=e481]:
                          - generic [ref=e485]: M'engager dans des initiatives à impact positif
                          - generic [ref=e488]:
                            - generic [ref=e489]: ⭐
                            - generic [ref=e490]: ⭐
                            - generic [ref=e491]: ⭐
                            - generic [ref=e492]: 3/5
  - contentinfo [ref=e493]:
    - generic [ref=e495]:
      - generic [ref=e496]:
        - link "Logo ANR" [ref=e497] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e498]
        - link "Logo France 2030" [ref=e499] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e500]
      - generic [ref=e501]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e502]:
      - generic [ref=e503]:
        - img "Logo Cofolio" [ref=e504]
        - generic [ref=e515]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e516]:
        - generic [ref=e517]:
          - generic [ref=e518]: Informations légales
          - list [ref=e519]:
            - listitem [ref=e520]:
              - 'link "Accessibilité : partiellement conforme" [ref=e521] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e522]:
              - link "Conditions générales d'utilisation" [ref=e523] [cursor=pointer]:
                - /url: /cofolio/student/cgu
            - listitem [ref=e524]:
              - link "Données personnelles" [ref=e525] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e526]:
              - link "Gestion des cookies" [ref=e527] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e528]:
          - generic [ref=e529]: Autres sites
          - list [ref=e530]:
            - listitem [ref=e531]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e532] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e533]:
          - generic [ref=e534]: Partenaires
          - generic [ref=e535]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e536] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e537]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e538] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e540]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e544] [cursor=pointer]:
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