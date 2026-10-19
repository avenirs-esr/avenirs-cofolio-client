# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Update Profile Drawer >> Student can open the update profile drawer
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js:29:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('section-navigation-select-navigation').locator('.av-select')

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
                    - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e116] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=a0dd11bd-ba57-4004-bb3e-b117b625d773
                      - generic [ref=e118]:
                        - generic [ref=e121]: Créativité
                        - generic [ref=e125]:
                          - generic [ref=e129]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                          - generic [ref=e132]:
                            - generic [ref=e133]: ⭐
                            - generic [ref=e134]: ⭐
                            - generic [ref=e135]: ⭐
                            - generic [ref=e136]: ⭐
                            - generic [ref=e137]: 4/5
                    - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration" [ref=e138] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=e0f7d0ab-57b1-4fae-bf9a-cebb764a287a
                      - generic [ref=e140]:
                        - generic [ref=e143]: Esprit d'équipe
                        - generic [ref=e151]: Je travaille efficacement avec les autres et favorise la collaboration
                    - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs" [ref=e152] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=103c7513-5321-4fce-8e3d-3ca293a8946c
                      - generic [ref=e154]:
                        - generic [ref=e157]: Leadership
                        - generic [ref=e165]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                    - link "Persévérance Je continue mes efforts même face aux difficultés ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e166] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=502da2de-4884-47da-b553-5b4f62af4a60
                      - generic [ref=e168]:
                        - generic [ref=e171]: Persévérance
                        - generic [ref=e175]:
                          - generic [ref=e179]: Je continue mes efforts même face aux difficultés
                          - generic [ref=e182]:
                            - generic [ref=e183]: ⭐
                            - generic [ref=e184]: ⭐
                            - generic [ref=e185]: ⭐
                            - generic [ref=e186]: ⭐
                            - generic [ref=e187]: 4/5
                    - link "Communication Je m'exprime clairement et j'écoute activement les autres ⭐ ⭐ ⭐ 3/5" [ref=e188] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=702c7870-3b5e-43fa-a397-5ce0d82a380b
                      - generic [ref=e190]:
                        - generic [ref=e193]: Communication
                        - generic [ref=e197]:
                          - generic [ref=e201]: Je m'exprime clairement et j'écoute activement les autres
                          - generic [ref=e204]:
                            - generic [ref=e205]: ⭐
                            - generic [ref=e206]: ⭐
                            - generic [ref=e207]: ⭐
                            - generic [ref=e208]: 3/5
                    - link "Adaptabilité Je m'ajuste facilement aux changements et aux nouvelles situations ⭐ ⭐ 2/5" [ref=e209] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=2074def9-fb1c-4fdd-969c-2e706542eccf
                      - generic [ref=e211]:
                        - generic [ref=e214]: Adaptabilité
                        - generic [ref=e218]:
                          - generic [ref=e222]: Je m'ajuste facilement aux changements et aux nouvelles situations
                          - generic [ref=e225]:
                            - generic [ref=e226]: ⭐
                            - generic [ref=e227]: ⭐
                            - generic [ref=e228]: 2/5
            - generic [ref=e229]:
              - generic [ref=e230]:
                - generic [ref=e231]:
                  - generic [ref=e235]: Mes valeurs (10)
                  - button "Gérer mes éléments" [ref=e239] [cursor=pointer]:
                    - generic [ref=e242]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e245] [cursor=pointer]
              - generic [ref=e249]:
                - generic [ref=e250]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                - generic [ref=e252]:
                  - navigation [ref=e253]:
                    - list [ref=e254]:
                      - listitem [ref=e255]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e256]:
                        - generic [ref=e258]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e259]:
                        - link "Page suivante" [ref=e262] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e265]:
                    - link "Respect Traiter les autres avec considération et dignité ⭐ ⭐ 2/5" [ref=e266] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=412b4174-ae29-4137-ba64-07d3087237c9
                      - generic [ref=e268]:
                        - generic [ref=e271]: Respect
                        - generic [ref=e275]:
                          - generic [ref=e279]: Traiter les autres avec considération et dignité
                          - generic [ref=e282]:
                            - generic [ref=e283]: ⭐
                            - generic [ref=e284]: ⭐
                            - generic [ref=e285]: 2/5
                    - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions ⭐ ⭐ ⭐ 3/5" [ref=e286] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=a526f873-01d2-4fce-ba2b-7e4d9ed525df
                      - generic [ref=e288]:
                        - generic [ref=e291]: Honnêteté
                        - generic [ref=e295]:
                          - generic [ref=e299]: Agir avec intégrité et transparence dans toutes mes interactions
                          - generic [ref=e302]:
                            - generic [ref=e303]: ⭐
                            - generic [ref=e304]: ⭐
                            - generic [ref=e305]: ⭐
                            - generic [ref=e306]: 3/5
                    - link "Solidarité Soutenir et aider les autres dans le besoin ⭐ ⭐ 2/5" [ref=e307] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=ee4340f1-3bb7-4387-be0d-cfa00b83b214
                      - generic [ref=e309]:
                        - generic [ref=e312]: Solidarité
                        - generic [ref=e316]:
                          - generic [ref=e320]: Soutenir et aider les autres dans le besoin
                          - generic [ref=e323]:
                            - generic [ref=e324]: ⭐
                            - generic [ref=e325]: ⭐
                            - generic [ref=e326]: 2/5
                    - link "Justice Promouvoir l'équité et l'égalité des chances pour tous" [ref=e327] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=be9014b0-1529-4722-afa9-b41e83d2c872
                      - generic [ref=e329]:
                        - generic [ref=e332]: Justice
                        - generic [ref=e340]: Promouvoir l'équité et l'égalité des chances pour tous
                    - link "Liberté Respecter l'autonomie et les choix de chacun" [ref=e341] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=517b0abc-da96-4dcb-97ac-abe2e7b6e64b
                      - generic [ref=e343]:
                        - generic [ref=e346]: Liberté
                        - generic [ref=e354]: Respecter l'autonomie et les choix de chacun
                    - link "Engagement M'investir pleinement dans mes projets et responsabilités" [ref=e355] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=5f72638c-003c-4f4b-93c4-59494a6a5c75
                      - generic [ref=e357]:
                        - generic [ref=e360]: Engagement
                        - generic [ref=e368]: M'investir pleinement dans mes projets et responsabilités
            - generic [ref=e369]:
              - generic [ref=e370]:
                - generic [ref=e371]:
                  - generic [ref=e375]: Mes envies (10)
                  - button "Gérer mes éléments" [ref=e379] [cursor=pointer]:
                    - generic [ref=e382]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e385] [cursor=pointer]
              - generic [ref=e389]:
                - generic [ref=e390]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                - generic [ref=e392]:
                  - navigation [ref=e393]:
                    - list [ref=e394]:
                      - listitem [ref=e395]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e396]:
                        - generic [ref=e398]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e399]:
                        - link "Page suivante" [ref=e402] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e405]:
                    - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise" [ref=e406] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=2be4f3f6-7785-4074-82aa-cbfab6a6dc86
                      - generic [ref=e408]:
                        - generic [ref=e411]: Développer mes compétences techniques
                        - generic [ref=e419]: Approfondir mes connaissances dans mon domaine d'expertise
                    - link "Manager une équipe Acquérir de l'expérience en gestion et leadership ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e420] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=236e3ca4-2d0e-45da-885f-62a70c75fe2f
                      - generic [ref=e422]:
                        - generic [ref=e425]: Manager une équipe
                        - generic [ref=e429]:
                          - generic [ref=e433]: Acquérir de l'expérience en gestion et leadership
                          - generic [ref=e436]:
                            - generic [ref=e437]: ⭐
                            - generic [ref=e438]: ⭐
                            - generic [ref=e439]: ⭐
                            - generic [ref=e440]: ⭐
                            - generic [ref=e441]: ⭐
                            - generic [ref=e442]: 5/5
                    - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons" [ref=e443] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=09a0a19b-500a-4d1b-9098-146a6e6b171d
                      - generic [ref=e445]:
                        - generic [ref=e448]: Voyager à l'étranger
                        - generic [ref=e456]: Découvrir de nouvelles cultures et élargir mes horizons
                    - link "Créer mon entreprise Développer un projet entrepreneurial qui me passionne ⭐ ⭐ 2/5" [ref=e457] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=480986d1-e915-4651-b9aa-d87b99ec0dcd
                      - generic [ref=e459]:
                        - generic [ref=e462]: Créer mon entreprise
                        - generic [ref=e466]:
                          - generic [ref=e470]: Développer un projet entrepreneurial qui me passionne
                          - generic [ref=e473]:
                            - generic [ref=e474]: ⭐
                            - generic [ref=e475]: ⭐
                            - generic [ref=e476]: 2/5
                    - link "Continuer mes études Poursuivre ma formation académique dans un domaine qui m'intéresse ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e477] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=f09ed25d-b13c-4016-b9b9-9078c0a92928
                      - generic [ref=e479]:
                        - generic [ref=e482]: Continuer mes études
                        - generic [ref=e486]:
                          - generic [ref=e490]: Poursuivre ma formation académique dans un domaine qui m'intéresse
                          - generic [ref=e493]:
                            - generic [ref=e494]: ⭐
                            - generic [ref=e495]: ⭐
                            - generic [ref=e496]: ⭐
                            - generic [ref=e497]: ⭐
                            - generic [ref=e498]: ⭐
                            - generic [ref=e499]: 5/5
                    - link "Contribuer à des projets sociaux M'engager dans des initiatives à impact positif" [ref=e500] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=b6b6bf00-40aa-43a4-b1d9-aac5c81b1c6b
                      - generic [ref=e502]:
                        - generic [ref=e505]: Contribuer à des projets sociaux
                        - generic [ref=e513]: M'engager dans des initiatives à impact positif
  - contentinfo [ref=e514]:
    - generic [ref=e516]:
      - generic [ref=e517]:
        - link "Logo ANR" [ref=e518] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e519]
        - link "Logo France 2030" [ref=e520] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e521]
      - generic [ref=e522]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e523]:
      - generic [ref=e524]:
        - img "Logo Cofolio" [ref=e525]
        - generic [ref=e536]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e537]:
        - generic [ref=e538]:
          - generic [ref=e539]: Informations légales
          - list [ref=e540]:
            - listitem [ref=e541]:
              - 'link "Accessibilité : partiellement conforme" [ref=e542] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e543]:
              - link "Conditions générales d'utilisation" [ref=e544] [cursor=pointer]:
                - /url: /cofolio/student/cgu
            - listitem [ref=e545]:
              - link "Données personnelles" [ref=e546] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e547]:
              - link "Gestion des cookies" [ref=e548] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e549]:
          - generic [ref=e550]: Autres sites
          - list [ref=e551]:
            - listitem [ref=e552]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e553] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e554]:
          - generic [ref=e555]: Partenaires
          - generic [ref=e556]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e557] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e558]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e559] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e561]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e565] [cursor=pointer]:
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
  23  |     return this.page.getByTestId('section-navigation-select-navigation')
  24  |   }
  25  | 
  26  |   private getSectionNavigationSelectTrigger () {
  27  |     return this.getSectionNavigationSelectNavigation()
  28  |       .locator('.av-select')
  29  |   }
  30  | 
  31  |   getSelfKnowledgeSideNavigationItem () {
  32  |     return this.page.getByTestId('collapsed-menu-SELF_KNOWLEDGE')
  33  |       .or(this.page.getByTestId('expanded-menu-SELF_KNOWLEDGE'))
  34  |   }
  35  | 
  36  |   async navigateToSelfKnowledgeSection () {
  37  |     const sideNavigation = this.getSectionNavigationSideNavigation()
  38  | 
  39  |     if (await sideNavigation.isVisible().catch(() => false)) {
  40  |       await this.getSelfKnowledgeSideNavigationItem().click()
  41  |       return
  42  |     }
  43  | 
  44  |     const select = this.getSectionNavigationSelectNavigation()
  45  | 
> 46  |     await this.getSectionNavigationSelectTrigger().click()
      |                                                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
  47  | 
  48  |     const collapse = select.getByTestId('av-select__collapse')
  49  |     await expect(collapse).toBeVisible()
  50  | 
  51  |     const optionLabel = collapse.locator(
  52  |       'label[for="select-collapse-options-list-SELF_KNOWLEDGE-checkbox"]',
  53  |     )
  54  | 
  55  |     await expect(optionLabel).toBeVisible()
  56  |     await optionLabel.click({ position: { x: 2, y: 2 } })
  57  |   }
  58  | 
  59  |   getUpdateProfileDrawer () {
  60  |     return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  61  |   }
  62  | 
  63  |   getDisplayUpdateProfileDrawerButton () {
  64  |     return this.page.getByTestId('display-update-profile-drawer-button')
  65  |   }
  66  | 
  67  |   getProfileCard () {
  68  |     return new ProfileCard(this.page.getByTestId('profile-card'))
  69  |   }
  70  | 
  71  |   getSectionTitle () {
  72  |     return this.page.getByTestId('self-knowledge-section-title')
  73  |   }
  74  | 
  75  |   @Given('the student opens the project self knowledge main section page')
  76  |   async goto () {
  77  |     await this.page.goto(STUDENT_ROUTES.PROJECT.BUILD_PROJECT.SELF_KNOWLEDGE)
  78  |     await waitForPageLoad(this.page)
  79  | 
  80  |     await this.navigateToSelfKnowledgeSection()
  81  |     await waitForPageLoad(this.page)
  82  |   }
  83  | 
  84  |   @Then('the student project self knowledge main section page is displayed')
  85  |   async verifyPageLoaded () {
  86  |     await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.BUILD_PROJECT.SELF_KNOWLEDGE)
  87  |   }
  88  | 
  89  |   @Then('the self-knowledge section title is displayed')
  90  |   async verifySectionTitle () {
  91  |     await expect(this.getSectionTitle()).toBeVisible()
  92  |     await expect(this.getSectionTitle()).toHaveText(
  93  |       t('student.selfKnowledge.SelfKnowledgeMainSection.title'),
  94  |     )
  95  |   }
  96  | 
  97  |   @When('the user clicks the display update profile drawer button')
  98  |   async clickDisplayUpdateProfileDrawerButton () {
  99  |     await this.getDisplayUpdateProfileDrawerButton().click()
  100 |     await waitForPageLoad(this.page)
  101 |   }
  102 | 
  103 |   @Then('the update profile drawer is opened in the project self knowledge main section page')
  104 |   async verifyUpdateProfileDrawerOpened () {
  105 |     await expect(this.getUpdateProfileDrawer()).toBeVisible()
  106 |   }
  107 | 
  108 |   @When('the user clicks the exit button on the update profile drawer')
  109 |   async closeDrawer () {
  110 |     const updateProfileDrawer = this.getUpdateProfileDrawer()
  111 |     const exitButton = updateProfileDrawer.locator('.av-cancel-confirm-buttons-container button').first()
  112 |     await exitButton.click()
  113 |   }
  114 | 
  115 |   @Then('the update profile drawer is closed in the project self knowledge main section page')
  116 |   async verifyUpdateProfileDrawerClosed () {
  117 |     await expect(this.getUpdateProfileDrawer()).toBeHidden()
  118 |   }
  119 | 
  120 |   @Then('the self-knowledge profile card is visible')
  121 |   async verifyProfileCardVisible () {
  122 |     await this.getProfileCard().isVisible()
  123 |   }
  124 | 
  125 |   @Then('all profile content is readable on mobile')
  126 |   async verifyProfileCardContent () {
  127 |     await this.getProfileCard().verifyCardContent()
  128 |   }
  129 | 
  130 |   @Then('the self-knowledge profile card banner is visible')
  131 |   async verifyProfileCardBannerVisible () {
  132 |     await this.getProfileCard().verifyProfileBanner()
  133 |   }
  134 | 
  135 |   @Then('the self-knowledge profile card picture is visible')
  136 |   async verifyProfileCardPictureVisible () {
  137 |     await this.getProfileCard().verifyProfilePicture()
  138 |   }
  139 | 
  140 |   @Then('the self-knowledge profile card name is visible')
  141 |   async verifyProfileCardNameVisible () {
  142 |     await this.getProfileCard().verifyFullName()
  143 |   }
  144 | 
  145 |   @Then('the self-knowledge profile card bio is visible')
  146 |   async verifyProfileCardBioVisible () {
```