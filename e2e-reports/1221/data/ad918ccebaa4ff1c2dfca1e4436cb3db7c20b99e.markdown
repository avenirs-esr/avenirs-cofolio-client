# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Responsive Behavior >> Profile card content is readable on mobile
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.mobile.feature.spec.js:21:5

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
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=0d6a273a-afc9-4506-8a37-9b7fd2508e6c
                      - generic [ref=e118]:
                        - generic [ref=e121]: Créativité
                        - generic [ref=e129]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                    - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e130] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=7966c45a-374a-46bf-9e7d-7ce76be604c8
                      - generic [ref=e132]:
                        - generic [ref=e135]: Esprit d'équipe
                        - generic [ref=e139]:
                          - generic [ref=e143]: Je travaille efficacement avec les autres et favorise la collaboration
                          - generic [ref=e146]:
                            - generic [ref=e147]: ⭐
                            - generic [ref=e148]: ⭐
                            - generic [ref=e149]: ⭐
                            - generic [ref=e150]: ⭐
                            - generic [ref=e151]: 4/5
                    - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs ⭐ 1/5" [ref=e152] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=02168ef7-b7ad-4df7-aedd-e9040907216a
                      - generic [ref=e154]:
                        - generic [ref=e157]: Leadership
                        - generic [ref=e161]:
                          - generic [ref=e165]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                          - generic [ref=e168]:
                            - generic [ref=e169]: ⭐
                            - generic [ref=e170]: 1/5
                    - link "Persévérance Je continue mes efforts même face aux difficultés ⭐ 1/5" [ref=e171] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=6e7c4143-ecea-4d1e-ba27-9f663f0e6e71
                      - generic [ref=e173]:
                        - generic [ref=e176]: Persévérance
                        - generic [ref=e180]:
                          - generic [ref=e184]: Je continue mes efforts même face aux difficultés
                          - generic [ref=e187]:
                            - generic [ref=e188]: ⭐
                            - generic [ref=e189]: 1/5
                    - link "Communication Je m'exprime clairement et j'écoute activement les autres ⭐ ⭐ ⭐ 3/5" [ref=e190] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=b8affc35-fe6a-47d4-a39f-49d58fc1c8e9
                      - generic [ref=e192]:
                        - generic [ref=e195]: Communication
                        - generic [ref=e199]:
                          - generic [ref=e203]: Je m'exprime clairement et j'écoute activement les autres
                          - generic [ref=e206]:
                            - generic [ref=e207]: ⭐
                            - generic [ref=e208]: ⭐
                            - generic [ref=e209]: ⭐
                            - generic [ref=e210]: 3/5
                    - link "Adaptabilité Je m'ajuste facilement aux changements et aux nouvelles situations ⭐ 1/5" [ref=e211] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/STRENGTHS?elementId=43f67325-4298-4150-a6f1-11cd144b9f11
                      - generic [ref=e213]:
                        - generic [ref=e216]: Adaptabilité
                        - generic [ref=e220]:
                          - generic [ref=e224]: Je m'ajuste facilement aux changements et aux nouvelles situations
                          - generic [ref=e227]:
                            - generic [ref=e228]: ⭐
                            - generic [ref=e229]: 1/5
            - generic [ref=e230]:
              - generic [ref=e231]:
                - generic [ref=e232]:
                  - generic [ref=e236]: Mes valeurs (10)
                  - button "Gérer mes éléments" [ref=e240] [cursor=pointer]:
                    - generic [ref=e243]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e246] [cursor=pointer]
              - generic [ref=e250]:
                - generic [ref=e251]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
                - generic [ref=e253]:
                  - navigation [ref=e254]:
                    - list [ref=e255]:
                      - listitem [ref=e256]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e257]:
                        - generic [ref=e259]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e260]:
                        - link "Page suivante" [ref=e263] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e266]:
                    - link "Respect Traiter les autres avec considération et dignité ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e267] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=106a5790-b84a-4e6e-a4f2-2748c1d83b35
                      - generic [ref=e269]:
                        - generic [ref=e272]: Respect
                        - generic [ref=e276]:
                          - generic [ref=e280]: Traiter les autres avec considération et dignité
                          - generic [ref=e283]:
                            - generic [ref=e284]: ⭐
                            - generic [ref=e285]: ⭐
                            - generic [ref=e286]: ⭐
                            - generic [ref=e287]: ⭐
                            - generic [ref=e288]: 4/5
                    - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions" [ref=e289] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=9c4718c1-02f4-4084-88a8-11dadfd56e30
                      - generic [ref=e291]:
                        - generic [ref=e294]: Honnêteté
                        - generic [ref=e302]: Agir avec intégrité et transparence dans toutes mes interactions
                    - link "Solidarité Soutenir et aider les autres dans le besoin" [ref=e303] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=78b211e9-c5c3-49be-a939-1e101e36a3e2
                      - generic [ref=e305]:
                        - generic [ref=e308]: Solidarité
                        - generic [ref=e316]: Soutenir et aider les autres dans le besoin
                    - link "Justice Promouvoir l'équité et l'égalité des chances pour tous ⭐ 1/5" [ref=e317] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=7a0d9f2b-3034-4ff7-8e1b-55de212968d0
                      - generic [ref=e319]:
                        - generic [ref=e322]: Justice
                        - generic [ref=e326]:
                          - generic [ref=e330]: Promouvoir l'équité et l'égalité des chances pour tous
                          - generic [ref=e333]:
                            - generic [ref=e334]: ⭐
                            - generic [ref=e335]: 1/5
                    - link "Liberté Respecter l'autonomie et les choix de chacun ⭐ ⭐ 2/5" [ref=e336] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=be795958-50c4-4252-b225-185f40b2356b
                      - generic [ref=e338]:
                        - generic [ref=e341]: Liberté
                        - generic [ref=e345]:
                          - generic [ref=e349]: Respecter l'autonomie et les choix de chacun
                          - generic [ref=e352]:
                            - generic [ref=e353]: ⭐
                            - generic [ref=e354]: ⭐
                            - generic [ref=e355]: 2/5
                    - link "Engagement M'investir pleinement dans mes projets et responsabilités ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e356] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/VALUES?elementId=746619e3-2050-4f55-b77f-239107d449dd
                      - generic [ref=e358]:
                        - generic [ref=e361]: Engagement
                        - generic [ref=e365]:
                          - generic [ref=e369]: M'investir pleinement dans mes projets et responsabilités
                          - generic [ref=e372]:
                            - generic [ref=e373]: ⭐
                            - generic [ref=e374]: ⭐
                            - generic [ref=e375]: ⭐
                            - generic [ref=e376]: ⭐
                            - generic [ref=e377]: 4/5
            - generic [ref=e378]:
              - generic [ref=e379]:
                - generic [ref=e380]:
                  - generic [ref=e384]: Mes envies (10)
                  - button "Gérer mes éléments" [ref=e388] [cursor=pointer]:
                    - generic [ref=e391]: Gérer mes éléments
                - button "Réduire" [expanded] [ref=e394] [cursor=pointer]
              - generic [ref=e398]:
                - generic [ref=e399]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                - generic [ref=e401]:
                  - navigation [ref=e402]:
                    - list [ref=e403]:
                      - listitem [ref=e404]: Page 1 sur 2
                      - listitem
                      - listitem [ref=e405]:
                        - generic [ref=e407]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                      - listitem [ref=e408]:
                        - link "Page suivante" [ref=e411] [cursor=pointer]:
                          - /url: "#page-2"
                      - listitem
                  - generic [ref=e414]:
                    - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise ⭐ ⭐ 2/5" [ref=e415] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=cba15c21-6779-4a10-8ce5-f57de2be553f
                      - generic [ref=e417]:
                        - generic [ref=e420]: Développer mes compétences techniques
                        - generic [ref=e424]:
                          - generic [ref=e428]: Approfondir mes connaissances dans mon domaine d'expertise
                          - generic [ref=e431]:
                            - generic [ref=e432]: ⭐
                            - generic [ref=e433]: ⭐
                            - generic [ref=e434]: 2/5
                    - link "Manager une équipe Acquérir de l'expérience en gestion et leadership ⭐ ⭐ ⭐ 3/5" [ref=e435] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=cd11e56b-c9a4-49a5-8b5c-b07c712bcce4
                      - generic [ref=e437]:
                        - generic [ref=e440]: Manager une équipe
                        - generic [ref=e444]:
                          - generic [ref=e448]: Acquérir de l'expérience en gestion et leadership
                          - generic [ref=e451]:
                            - generic [ref=e452]: ⭐
                            - generic [ref=e453]: ⭐
                            - generic [ref=e454]: ⭐
                            - generic [ref=e455]: 3/5
                    - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons ⭐ 1/5" [ref=e456] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=29a9223b-0dce-4c47-801d-66634b5636b8
                      - generic [ref=e458]:
                        - generic [ref=e461]: Voyager à l'étranger
                        - generic [ref=e465]:
                          - generic [ref=e469]: Découvrir de nouvelles cultures et élargir mes horizons
                          - generic [ref=e472]:
                            - generic [ref=e473]: ⭐
                            - generic [ref=e474]: 1/5
                    - link "Créer mon entreprise Développer un projet entrepreneurial qui me passionne ⭐ ⭐ ⭐ 3/5" [ref=e475] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=407de97f-71fa-4bc2-92ca-ab6150c99610
                      - generic [ref=e477]:
                        - generic [ref=e480]: Créer mon entreprise
                        - generic [ref=e484]:
                          - generic [ref=e488]: Développer un projet entrepreneurial qui me passionne
                          - generic [ref=e491]:
                            - generic [ref=e492]: ⭐
                            - generic [ref=e493]: ⭐
                            - generic [ref=e494]: ⭐
                            - generic [ref=e495]: 3/5
                    - link "Continuer mes études Poursuivre ma formation académique dans un domaine qui m'intéresse ⭐ ⭐ ⭐ 3/5" [ref=e496] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=e4c05d02-37d4-49d6-86f3-321fa186f438
                      - generic [ref=e498]:
                        - generic [ref=e501]: Continuer mes études
                        - generic [ref=e505]:
                          - generic [ref=e509]: Poursuivre ma formation académique dans un domaine qui m'intéresse
                          - generic [ref=e512]:
                            - generic [ref=e513]: ⭐
                            - generic [ref=e514]: ⭐
                            - generic [ref=e515]: ⭐
                            - generic [ref=e516]: 3/5
                    - link "Contribuer à des projets sociaux M'engager dans des initiatives à impact positif" [ref=e517] [cursor=pointer]:
                      - /url: /cofolio/student/project/build-project/self-knowledge/ASPIRATIONS?elementId=21b349d1-af30-4c83-bd3c-ed41b531c03c
                      - generic [ref=e519]:
                        - generic [ref=e522]: Contribuer à des projets sociaux
                        - generic [ref=e530]: M'engager dans des initiatives à impact positif
  - contentinfo [ref=e531]:
    - generic [ref=e533]:
      - generic [ref=e534]:
        - link "Logo ANR" [ref=e535] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e536]
        - link "Logo France 2030" [ref=e537] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e538]
      - generic [ref=e539]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e540]:
      - generic [ref=e541]:
        - img "Logo Cofolio" [ref=e542]
        - generic [ref=e553]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e554]:
        - generic [ref=e555]:
          - generic [ref=e556]: Informations légales
          - list [ref=e557]:
            - listitem [ref=e558]:
              - 'link "Accessibilité : partiellement conforme" [ref=e559] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e560]:
              - link "Conditions générales d'utilisation" [ref=e561] [cursor=pointer]:
                - /url: /cofolio/student/cgu
            - listitem [ref=e562]:
              - link "Données personnelles" [ref=e563] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e564]:
              - link "Gestion des cookies" [ref=e565] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e566]:
          - generic [ref=e567]: Autres sites
          - list [ref=e568]:
            - listitem [ref=e569]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e570] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e571]:
          - generic [ref=e572]: Partenaires
          - generic [ref=e573]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e574] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e575]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e576] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e578]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e582] [cursor=pointer]:
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