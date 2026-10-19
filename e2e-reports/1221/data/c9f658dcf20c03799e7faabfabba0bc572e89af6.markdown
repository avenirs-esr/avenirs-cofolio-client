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
                    - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes ⭐ 1/5" [ref=e116] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=23476552-e85f-4777-b6b7-41361da4d7dd
                      - generic [ref=e118]:
                        - generic [ref=e121]: Créativité
                        - generic [ref=e125]:
                          - generic [ref=e129]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                          - generic [ref=e132]:
                            - generic [ref=e133]: ⭐
                            - generic [ref=e134]: 1/5
                    - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e135] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=94eaa413-7624-4b27-8b95-34c6f94903c6
                      - generic [ref=e137]:
                        - generic [ref=e140]: Esprit d'équipe
                        - generic [ref=e144]:
                          - generic [ref=e148]: Je travaille efficacement avec les autres et favorise la collaboration
                          - generic [ref=e151]:
                            - generic [ref=e152]: ⭐
                            - generic [ref=e153]: ⭐
                            - generic [ref=e154]: ⭐
                            - generic [ref=e155]: ⭐
                            - generic [ref=e156]: ⭐
                            - generic [ref=e157]: 5/5
                    - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs ⭐ ⭐ 2/5" [ref=e158] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=571f6f27-0d68-4c86-b492-52dafacf9ecc
                      - generic [ref=e160]:
                        - generic [ref=e163]: Leadership
                        - generic [ref=e167]:
                          - generic [ref=e171]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                          - generic [ref=e174]:
                            - generic [ref=e175]: ⭐
                            - generic [ref=e176]: ⭐
                            - generic [ref=e177]: 2/5
                    - link "Persévérance Je continue mes efforts même face aux difficultés" [ref=e178] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=5f1d5935-eb9e-4e3b-8a3c-2ac7b004dd28
                      - generic [ref=e180]:
                        - generic [ref=e183]: Persévérance
                        - generic [ref=e191]: Je continue mes efforts même face aux difficultés
                    - link "Communication Je m'exprime clairement et j'écoute activement les autres ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e192] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=e76fa567-132f-49fc-8adc-73c8375c33dd
                      - generic [ref=e194]:
                        - generic [ref=e197]: Communication
                        - generic [ref=e201]:
                          - generic [ref=e205]: Je m'exprime clairement et j'écoute activement les autres
                          - generic [ref=e208]:
                            - generic [ref=e209]: ⭐
                            - generic [ref=e210]: ⭐
                            - generic [ref=e211]: ⭐
                            - generic [ref=e212]: ⭐
                            - generic [ref=e213]: ⭐
                            - generic [ref=e214]: 5/5
                    - link "Adaptabilité Je m'ajuste facilement aux changements et aux nouvelles situations ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e215] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=c0a5bb32-736b-495c-b2f2-0f12b8c558a0
                      - generic [ref=e217]:
                        - generic [ref=e220]: Adaptabilité
                        - generic [ref=e224]:
                          - generic [ref=e228]: Je m'ajuste facilement aux changements et aux nouvelles situations
                          - generic [ref=e231]:
                            - generic [ref=e232]: ⭐
                            - generic [ref=e233]: ⭐
                            - generic [ref=e234]: ⭐
                            - generic [ref=e235]: ⭐
                            - generic [ref=e236]: 4/5
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]:
                  - generic [ref=e243]: Mes valeurs (10)
                  - button "Gérer mes éléments" [ref=e247] [cursor=pointer]:
                    - generic [ref=e250]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e253] [cursor=pointer]
              - generic [ref=e257]:
                - generic [ref=e258]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                - generic [ref=e260]:
                  - navigation [ref=e261]:
                    - list [ref=e262]:
                      - listitem [ref=e263]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e264]:
                        - generic [ref=e266]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e267]:
                        - link "Page suivante" [ref=e270] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e273]:
                    - link "Respect Traiter les autres avec considération et dignité ⭐ 1/5" [ref=e274] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=87e5a18b-3c4e-4906-83e2-783a1acc68d0
                      - generic [ref=e276]:
                        - generic [ref=e279]: Respect
                        - generic [ref=e283]:
                          - generic [ref=e287]: Traiter les autres avec considération et dignité
                          - generic [ref=e290]:
                            - generic [ref=e291]: ⭐
                            - generic [ref=e292]: 1/5
                    - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions ⭐ ⭐ 2/5" [ref=e293] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=b1ed3d9e-f3e5-47d5-95b7-4b2ff33d3a0e
                      - generic [ref=e295]:
                        - generic [ref=e298]: Honnêteté
                        - generic [ref=e302]:
                          - generic [ref=e306]: Agir avec intégrité et transparence dans toutes mes interactions
                          - generic [ref=e309]:
                            - generic [ref=e310]: ⭐
                            - generic [ref=e311]: ⭐
                            - generic [ref=e312]: 2/5
                    - link "Solidarité Soutenir et aider les autres dans le besoin" [ref=e313] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=dff645d8-ab60-492c-a568-cccf4f9c4ee3
                      - generic [ref=e315]:
                        - generic [ref=e318]: Solidarité
                        - generic [ref=e326]: Soutenir et aider les autres dans le besoin
                    - link "Justice Promouvoir l'équité et l'égalité des chances pour tous" [ref=e327] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=295b6182-8451-43fe-9649-a595ecda832b
                      - generic [ref=e329]:
                        - generic [ref=e332]: Justice
                        - generic [ref=e340]: Promouvoir l'équité et l'égalité des chances pour tous
                    - link "Liberté Respecter l'autonomie et les choix de chacun" [ref=e341] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=544a99f9-9333-4b17-ab50-f78d2ac1ab90
                      - generic [ref=e343]:
                        - generic [ref=e346]: Liberté
                        - generic [ref=e354]: Respecter l'autonomie et les choix de chacun
                    - link "Engagement M'investir pleinement dans mes projets et responsabilités" [ref=e355] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=1b767509-2b4e-4781-81e6-f10e32f1b3bb
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
                    - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e406] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=db7e1df4-ed92-4b0c-8c32-b0c10641e032
                      - generic [ref=e408]:
                        - generic [ref=e411]: Développer mes compétences techniques
                        - generic [ref=e415]:
                          - generic [ref=e419]: Approfondir mes connaissances dans mon domaine d'expertise
                          - generic [ref=e422]:
                            - generic [ref=e423]: ⭐
                            - generic [ref=e424]: ⭐
                            - generic [ref=e425]: ⭐
                            - generic [ref=e426]: ⭐
                            - generic [ref=e427]: 4/5
                    - link "Manager une équipe Acquérir de l'expérience en gestion et leadership" [ref=e428] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=607298d8-145f-47a9-b4a6-b7caf3fc735d
                      - generic [ref=e430]:
                        - generic [ref=e433]: Manager une équipe
                        - generic [ref=e441]: Acquérir de l'expérience en gestion et leadership
                    - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons" [ref=e442] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=e2ab5d56-0b72-4d15-88e5-17b069fac7f5
                      - generic [ref=e444]:
                        - generic [ref=e447]: Voyager à l'étranger
                        - generic [ref=e455]: Découvrir de nouvelles cultures et élargir mes horizons
                    - link "Créer mon entreprise Développer un projet entrepreneurial qui me passionne ⭐ ⭐ ⭐ 3/5" [ref=e456] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=127f2adc-342c-43fc-9e50-eec390258ac6
                      - generic [ref=e458]:
                        - generic [ref=e461]: Créer mon entreprise
                        - generic [ref=e465]:
                          - generic [ref=e469]: Développer un projet entrepreneurial qui me passionne
                          - generic [ref=e472]:
                            - generic [ref=e473]: ⭐
                            - generic [ref=e474]: ⭐
                            - generic [ref=e475]: ⭐
                            - generic [ref=e476]: 3/5
                    - link "Continuer mes études Poursuivre ma formation académique dans un domaine qui m'intéresse" [ref=e477] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=0c4f154d-f431-4f5b-947a-e528336cce99
                      - generic [ref=e479]:
                        - generic [ref=e482]: Continuer mes études
                        - generic [ref=e490]: Poursuivre ma formation académique dans un domaine qui m'intéresse
                    - link "Contribuer à des projets sociaux M'engager dans des initiatives à impact positif ⭐ ⭐ ⭐ 3/5" [ref=e491] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=3c1e13a6-bbda-445d-bcf6-0643289cfcd0
                      - generic [ref=e493]:
                        - generic [ref=e496]: Contribuer à des projets sociaux
                        - generic [ref=e500]:
                          - generic [ref=e504]: M'engager dans des initiatives à impact positif
                          - generic [ref=e507]:
                            - generic [ref=e508]: ⭐
                            - generic [ref=e509]: ⭐
                            - generic [ref=e510]: ⭐
                            - generic [ref=e511]: 3/5
  - contentinfo [ref=e512]:
    - generic [ref=e514]:
      - generic [ref=e515]:
        - link "Logo ANR" [ref=e516] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e517]
        - link "Logo France 2030" [ref=e518] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e519]
      - generic [ref=e520]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e521]:
      - generic [ref=e522]:
        - img "Logo Cofolio" [ref=e523]
        - generic [ref=e534]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e535]:
        - generic [ref=e536]:
          - generic [ref=e537]: Informations légales
          - list [ref=e538]:
            - listitem [ref=e539]:
              - 'link "Accessibilité : partiellement conforme" [ref=e540] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e541]:
              - link "Conditions générales d'utilisation" [ref=e542] [cursor=pointer]:
                - /url: /cofolio/student/cgu
            - listitem [ref=e543]:
              - link "Données personnelles" [ref=e544] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e545]:
              - link "Gestion des cookies" [ref=e546] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e547]:
          - generic [ref=e548]: Autres sites
          - list [ref=e549]:
            - listitem [ref=e550]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e551] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e552]:
          - generic [ref=e553]: Partenaires
          - generic [ref=e554]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e555] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e556]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e557] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e559]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e563] [cursor=pointer]:
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