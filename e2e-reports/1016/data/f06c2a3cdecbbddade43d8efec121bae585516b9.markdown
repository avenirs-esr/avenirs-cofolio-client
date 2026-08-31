# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/selfKnowledge/selfKnowledge.feature.spec.js >> Student Project Self-Knowledge Main Section Page >> Update Profile Drawer >> Student can close the update profile drawer
- Location: .features-gen/tests/student/lifeProject/selfKnowledge/selfKnowledge.feature.spec.js:38:5

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
      - generic [ref=e13]:
        - link "Accueil - Cofolio Étudiant" [ref=e19] [cursor=pointer]:
          - /url: /cofolio/student
          - img [ref=e20]
        - generic [ref=e23]:
          - list [ref=e26]:
            - listitem [ref=e27]:
              - button "Messagerie" [ref=e30] [cursor=pointer]:
                - generic [ref=e33]: Messagerie
            - listitem [ref=e34]:
              - button "Notifications" [ref=e37] [cursor=pointer]:
                - generic [ref=e40]: Notifications
            - listitem [ref=e41]:
              - button "J. moulin" [ref=e44] [cursor=pointer]:
                - generic [ref=e47]: J. moulin
          - navigation [ref=e50]:
            - button "FR" [ref=e53] [cursor=pointer]:
              - generic [ref=e56]: FR
      - navigation "Menu principal" [ref=e60]:
        - list [ref=e61]:
          - listitem [ref=e62]:
            - link "ACCUEIL" [ref=e63] [cursor=pointer]:
              - /url: /cofolio/student
              - generic [ref=e66]: ACCUEIL
          - listitem [ref=e67]:
            - button "CONSTRUIRE MON PROJET DE VIE" [ref=e68] [cursor=pointer]:
              - generic [ref=e69]: CONSTRUIRE MON PROJET DE VIE
          - listitem [ref=e70]:
            - button "MES OUTILS" [ref=e71] [cursor=pointer]:
              - generic [ref=e72]: MES OUTILS
    - main [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e76]:
          - navigation "Fil d'Ariane" [ref=e77]:
            - list [ref=e79]:
              - listitem [ref=e80]:
                - link "Accueil" [ref=e81] [cursor=pointer]:
                  - /url: /cofolio/student
              - listitem [ref=e82]:
                - generic: Construire mon projet de vie
              - listitem [ref=e83]:
                - generic: Bâtir mon projet
              - listitem [ref=e84]:
                - generic: Me connaître
          - heading "Bâtir mon projet" [level=1] [ref=e85]
        - generic [ref=e87]:
          - navigation "777adb1c-089b-4d83-99e3-3dee30618199 navigation" [ref=e88]:
            - button "Réduire le menu" [expanded] [ref=e92] [cursor=pointer]
            - menu [ref=e96]:
              - menuitem "Bâtir mon projet" [ref=e97]:
                - button "Bâtir mon projet" [ref=e98] [cursor=pointer]:
                  - generic [ref=e103]: Bâtir mon projet
              - menuitem "Me connaître" [ref=e104]:
                - button "Me connaître" [ref=e105] [cursor=pointer]:
                  - generic [ref=e110]: Me connaître
              - menuitem "Explorer mes futurs" [ref=e111]:
                - button "Explorer mes futurs" [ref=e112] [cursor=pointer]:
                  - generic [ref=e117]: Explorer mes futurs
              - menuitem "Mes Trajectoires" [ref=e118]:
                - button "Mes Trajectoires" [ref=e119] [cursor=pointer]:
                  - generic [ref=e124]: Mes Trajectoires
          - generic [ref=e126]:
            - generic [ref=e132]: Qui je suis ?
            - button "Modifier mon profil" [active] [ref=e134] [cursor=pointer]:
              - generic [ref=e137]: Modifier mon profil
            - generic [ref=e138]:
              - generic [ref=e140]:
                - img "Bannière du profil" [ref=e141]
                - img "Photo de profil" [ref=e143]
              - generic [ref=e146]:
                - generic [ref=e147]: Jeanne Moulin
                - generic [ref=e148]: Je suis étudiante en chimie et écologie. Passionnée par l'innovation durable, je souhaite utiliser la science pour protéger l'environnement et bâtir un avenir plus respectueux de la planète.
            - button "Ajouter une catégorie" [ref=e150] [cursor=pointer]:
              - generic [ref=e153]: Ajouter une catégorie
            - generic [ref=e154]:
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - generic [ref=e157]:
                    - generic [ref=e161]: Mes points forts (10)
                    - button "Plus d'actions" [ref=e165] [cursor=pointer]:
                      - generic [ref=e168]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e171] [cursor=pointer]
                - generic [ref=e175]:
                  - generic [ref=e176]: Identifier et valoriser mes qualités, talents et réussites marquantes.
                  - generic [ref=e178]:
                    - navigation [ref=e179]:
                      - list [ref=e180]:
                        - listitem [ref=e181]: Page 1 sur 4
                        - listitem
                        - listitem [ref=e182]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                        - listitem [ref=e183]:
                          - link "Page suivante" [ref=e186] [cursor=pointer]:
                            - /url: "#page-2"
                        - listitem
                    - generic [ref=e189]:
                      - link "Créativité Je suis capable de trouver des solutions originales et innovantes aux problèmes" [ref=e190] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=e6343f91-8f45-4400-8a29-900367e5cfba
                        - generic [ref=e192]:
                          - generic "Créativité" [ref=e195]
                          - paragraph [ref=e203]: Je suis capable de trouver des solutions originales et innovantes aux problèmes
                      - link "Esprit d'équipe Je travaille efficacement avec les autres et favorise la collaboration ⭐ ⭐ 2/5" [ref=e204] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=fca46119-61f0-42e0-b9c6-ed3babe06f4a
                        - generic [ref=e206]:
                          - generic "Esprit d'équipe" [ref=e209]
                          - generic [ref=e213]:
                            - paragraph [ref=e217]: Je travaille efficacement avec les autres et favorise la collaboration
                            - generic [ref=e220]:
                              - generic [ref=e221]: ⭐
                              - generic [ref=e222]: ⭐
                              - generic [ref=e223]: 2/5
                      - link "Leadership Je sais prendre des initiatives et guider une équipe vers ses objectifs ⭐ ⭐ ⭐ ⭐ 4/5" [ref=e224] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/STRENGTHS?elementId=6ae5cc81-842a-4abb-9a04-c0144e921f1c
                        - generic [ref=e226]:
                          - generic "Leadership" [ref=e229]
                          - generic [ref=e233]:
                            - paragraph [ref=e237]: Je sais prendre des initiatives et guider une équipe vers ses objectifs
                            - generic [ref=e240]:
                              - generic [ref=e241]: ⭐
                              - generic [ref=e242]: ⭐
                              - generic [ref=e243]: ⭐
                              - generic [ref=e244]: ⭐
                              - generic [ref=e245]: 4/5
              - generic [ref=e246]:
                - generic [ref=e247]:
                  - generic [ref=e248]:
                    - generic [ref=e252]: Mes valeurs (10)
                    - button "Plus d'actions" [ref=e256] [cursor=pointer]:
                      - generic [ref=e259]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e262] [cursor=pointer]
                - generic [ref=e266]:
                  - generic [ref=e267]: Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.
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
                      - link "Respect Traiter les autres avec considération et dignité ⭐ ⭐ ⭐ ⭐ ⭐ 5/5" [ref=e281] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=6f5a77dc-9de6-44a5-adf3-7296625c4e4b
                        - generic [ref=e283]:
                          - generic "Respect" [ref=e286]
                          - generic [ref=e290]:
                            - paragraph [ref=e294]: Traiter les autres avec considération et dignité
                            - generic [ref=e297]:
                              - generic [ref=e298]: ⭐
                              - generic [ref=e299]: ⭐
                              - generic [ref=e300]: ⭐
                              - generic [ref=e301]: ⭐
                              - generic [ref=e302]: ⭐
                              - generic [ref=e303]: 5/5
                      - link "Honnêteté Agir avec intégrité et transparence dans toutes mes interactions ⭐ 1/5" [ref=e304] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=5a110daa-d8c9-44d3-a3c8-1a00d898a10a
                        - generic [ref=e306]:
                          - generic "Honnêteté" [ref=e309]
                          - generic [ref=e313]:
                            - paragraph [ref=e317]: Agir avec intégrité et transparence dans toutes mes interactions
                            - generic [ref=e320]:
                              - generic [ref=e321]: ⭐
                              - generic [ref=e322]: 1/5
                      - link "Solidarité Soutenir et aider les autres dans le besoin" [ref=e323] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/VALUES?elementId=a159daa1-8bc8-4072-a4d3-f48dbe8e4053
                        - generic [ref=e325]:
                          - generic "Solidarité" [ref=e328]
                          - paragraph [ref=e336]: Soutenir et aider les autres dans le besoin
              - generic [ref=e337]:
                - generic [ref=e338]:
                  - generic [ref=e339]:
                    - generic [ref=e343]: Mes envies (10)
                    - button "Plus d'actions" [ref=e347] [cursor=pointer]:
                      - generic [ref=e350]: Plus d'actions
                  - button "Réduire" [expanded] [ref=e353] [cursor=pointer]
                - generic [ref=e357]:
                  - generic [ref=e358]: Clarifier ce que j'ai envie d'explorer, d'apprendre ou de vivre à court et moyen terme.
                  - generic [ref=e360]:
                    - navigation [ref=e361]:
                      - list [ref=e362]:
                        - listitem [ref=e363]: Page 1 sur 4
                        - listitem
                        - listitem [ref=e364]:
                          - link "Page précédente" [disabled]:
                            - /url: "#page-1"
                        - listitem [ref=e365]:
                          - link "Page suivante" [ref=e368] [cursor=pointer]:
                            - /url: "#page-2"
                        - listitem
                    - generic [ref=e371]:
                      - link "Développer mes compétences techniques Approfondir mes connaissances dans mon domaine d'expertise" [ref=e372] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=49f95a25-60cb-4f78-9958-c71ad78d5e35
                        - generic [ref=e374]:
                          - generic "Développer mes compétences techniques" [ref=e377]
                          - paragraph [ref=e385]: Approfondir mes connaissances dans mon domaine d'expertise
                      - link "Manager une équipe Acquérir de l'expérience en gestion et leadership" [ref=e386] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=7f467415-ec14-44c3-9ffa-b8d4de3006a5
                        - generic [ref=e388]:
                          - generic "Manager une équipe" [ref=e391]
                          - paragraph [ref=e399]: Acquérir de l'expérience en gestion et leadership
                      - link "Voyager à l'étranger Découvrir de nouvelles cultures et élargir mes horizons" [ref=e400] [cursor=pointer]:
                        - /url: /cofolio/student/project/trajectories/self-knowledge/ASPIRATIONS?elementId=7e1db8bd-1c4d-49f6-ab1e-7d7bd28cf9f7
                        - generic [ref=e402]:
                          - generic "Voyager à l'étranger" [ref=e405]
                          - paragraph [ref=e413]: Découvrir de nouvelles cultures et élargir mes horizons
    - contentinfo [ref=e414]:
      - generic [ref=e416]:
        - generic [ref=e417]:
          - link "Logo ANR" [ref=e418] [cursor=pointer]:
            - /url: https://anr.fr/ProjetIA-21-DMAV-0001
            - img "Logo ANR" [ref=e419]
          - link "Logo France 2030" [ref=e420] [cursor=pointer]:
            - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
            - img "Logo France 2030" [ref=e421]
        - generic [ref=e422]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
      - generic [ref=e423]:
        - generic [ref=e424]:
          - img "Logo Cofolio" [ref=e425]
          - generic [ref=e436]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
        - generic [ref=e437]:
          - generic [ref=e438]:
            - generic [ref=e439]: Informations légales
            - list [ref=e440]:
              - listitem [ref=e441]:
                - 'link "Accessibilité : partiellement conforme" [ref=e442] [cursor=pointer]':
                  - /url: /cofolio/student/accessibility
              - listitem [ref=e443]:
                - link "Mentions légales" [ref=e444] [cursor=pointer]:
                  - /url: /cofolio/student/legal
              - listitem [ref=e445]:
                - link "Données personnelles" [ref=e446] [cursor=pointer]:
                  - /url: /cofolio/student/personal-data
              - listitem [ref=e447]:
                - link "Gestion des cookies" [ref=e448] [cursor=pointer]:
                  - /url: /cofolio/student/cookies
          - generic [ref=e449]:
            - generic [ref=e450]: Autres sites
            - list [ref=e451]:
              - listitem [ref=e452]:
                - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e453] [cursor=pointer]:
                  - /url: https://avenirs-esr.fr/
                  - text: avenirs-esr.fr
          - generic [ref=e454]:
            - generic [ref=e455]: Partenaires
            - generic [ref=e456]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e457] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - img "Logo Avenir(s) ESR" [ref=e458]
              - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e459] [cursor=pointer]:
                - /url: https://www.esup-portail.org/
                - img "Logo Esup Portail" [ref=e461]
      - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e465] [cursor=pointer]:
        - /url: https://www.esup-portail.org/
        - text: "@ESUP-Portail. Tous droits réservés."
  - dialog "Menu latéral" [ref=e467]:
    - generic [ref=e468]:
      - generic [ref=e470]:
        - generic [ref=e476]: Modifier mon profil
        - group "Accordion group" [ref=e478]:
          - heading "Identité" [level=3] [ref=e480]:
            - button "Identité" [ref=e481] [cursor=pointer]:
              - generic [ref=e485]: Identité
          - heading "Couverture" [level=3] [ref=e487]:
            - button "Couverture" [ref=e488] [cursor=pointer]:
              - generic [ref=e492]: Couverture
          - heading "Photo de profil" [level=3] [ref=e494]:
            - button "Photo de profil" [ref=e495] [cursor=pointer]:
              - generic [ref=e499]: Photo de profil
      - generic [ref=e502]:
        - button "Quitter" [ref=e503] [cursor=pointer]:
          - generic [ref=e506]: Quitter
        - button "Enregistrer" [disabled] [ref=e507]:
          - generic [ref=e510]: Enregistrer
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