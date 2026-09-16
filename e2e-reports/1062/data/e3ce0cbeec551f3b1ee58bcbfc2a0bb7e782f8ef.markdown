# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/activityDetails/activityDetails.mobile.feature.spec.js >> Student Project Activity Page (Mobile) >> Activity - Responsive behavior >> No horizontal scrolling on activity page
- Location: .features-gen/tests/student/lifeProject/activityDetails/activityDetails.mobile.feature.spec.js:15:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:4173/cofolio/student/activities?tab=ACTIVITY_LIBRARY"
  navigated to "http://localhost:4173/cofolio/student/activity/declared-activity-1"
  navigated to "http://localhost:4173/cofolio/student/activity/declared-activity-1?section=DETAIL"
============================================================
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
    - generic [ref=e15]:
      - link "Accueil - Cofolio Étudiant" [ref=e19] [cursor=pointer]:
        - /url: /cofolio/student
        - img [ref=e20]
      - button "Menu" [ref=e25] [cursor=pointer]
  - main [ref=e28]:
    - generic [ref=e30]:
      - generic [ref=e32]:
        - navigation "Fil d'Ariane" [ref=e33]:
          - button "Voir le fil d'Ariane" [ref=e34] [cursor=pointer]:
            - generic [ref=e35]: Voir le fil d'Ariane
        - 'heading "Détail Activité \"Connaissance de soi\" : Définir ses valeurs" [level=1] [ref=e36]':
          - text: Détail
          - generic [ref=e39]: "Activité \"Connaissance de soi\" : Définir ses valeurs"
      - generic [ref=e41]:
        - status [ref=e42]:
          - generic [ref=e43]: En cours
        - button "Gérer mon activité" [ref=e46] [cursor=pointer]:
          - generic [ref=e49]: Gérer mon activité
      - generic [ref=e50]:
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: Accéder à
            - combobox "Accéder à" [ref=e57] [cursor=pointer]:
              - option "Détail" [selected]
              - option "Ma réflexion"
          - status
        - generic [ref=e59]:
          - status [ref=e60]:
            - generic [ref=e61]: Non valorisée dans mon kit
          - generic [ref=e63]:
            - generic [ref=e66]:
              - generic [ref=e68]: Début
              - generic [ref=e69]:
                - textbox "Début" [disabled]:
                  - /placeholder: ""
                - textbox "Début" [disabled]:
                  - /placeholder: ""
                  - text: 01/01/2024
            - generic [ref=e72]:
              - generic [ref=e74]: Fin
              - generic [ref=e75]:
                - textbox "Fin" [disabled]:
                  - /placeholder: ""
                  - text: 2024-06-30
                - textbox "Fin" [disabled]:
                  - /placeholder: ""
                  - text: 30/06/2024
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e83]: "Activité \"Connaissance de soi\" : Définir ses valeurs"
              - generic [ref=e84]:
                - heading "Objectifs de l'activité" [level=3] [ref=e85]
                - list [ref=e86]:
                  - listitem [ref=e87]:
                    - paragraph [ref=e88]: Permettre à l'étudiant.e de déterminer des valeurs auxquelles il/elle est attaché.e
                  - listitem [ref=e89]:
                    - paragraph [ref=e90]: Encourager l'étudiant.e à réfléchir à la façon dont ces valeurs s'incarnent dans ses comportements et ses pratiques quotidiennes
                - heading "Contenu de l'activité" [level=3] [ref=e91]
                - paragraph [ref=e92]: "L'activité se compose de plusieurs étapes :"
                - list [ref=e93]:
                  - listitem [ref=e94]:
                    - paragraph [ref=e95]: Identification des valeurs personnelles clés
                  - listitem [ref=e96]:
                    - paragraph [ref=e97]: Réflexion sur la manière dont ces valeurs s'incarnent dans les comportements et les pratiques quotidiens
                  - listitem [ref=e98]:
                    - paragraph [ref=e99]: Mise en perspective de ces valeurs avec le projet de vie envisagé
            - generic [ref=e100]:
              - generic [ref=e101]: Contexte(s) de réalisation conseillé(s)
              - list [ref=e102]:
                - listitem [ref=e103]: À réaliser en amont d'un entretien avec un.e conseiller/conseillère ou chargé.e d'orientation et/ou d'insertion professionnelle
                - listitem [ref=e104]: avant une autre activité si parcours d'activités Cofolio
          - generic [ref=e108]: Modalités de l’activité
          - generic [ref=e109]:
            - generic [ref=e110]:
              - generic [ref=e115]: Demande de feedback
              - status [ref=e118]:
                - generic [ref=e119]: Limité à 10 itérations
            - generic [ref=e120]:
              - generic [ref=e125]: Association de traces
              - status [ref=e128]:
                - generic [ref=e129]: Traces illimitées
  - contentinfo [ref=e130]:
    - generic [ref=e132]:
      - generic [ref=e133]:
        - link "Logo ANR" [ref=e134] [cursor=pointer]:
          - /url: https://anr.fr/ProjetIA-21-DMAV-0001
          - img "Logo ANR" [ref=e135]
        - link "Logo France 2030" [ref=e136] [cursor=pointer]:
          - /url: https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de
          - img "Logo France 2030" [ref=e137]
      - generic [ref=e138]: Ce travail a bénéficié d'une aide de l'État gérée par l'Agence Nationale de la Recherche au titre du programme d'investissements d'avenir intégré à France 2030, portant la référence ANR-21-DMAV-0001
    - generic [ref=e139]:
      - generic [ref=e140]:
        - img "Logo Cofolio" [ref=e141]
        - generic [ref=e152]: Un ePortfolio pour l'Enseignement Supérieur et la Recherche
      - generic [ref=e153]:
        - generic [ref=e154]:
          - generic [ref=e155]: Informations légales
          - list [ref=e156]:
            - listitem [ref=e157]:
              - 'link "Accessibilité : partiellement conforme" [ref=e158] [cursor=pointer]':
                - /url: /cofolio/student/accessibility
            - listitem [ref=e159]:
              - link "Mentions légales" [ref=e160] [cursor=pointer]:
                - /url: /cofolio/student/legal
            - listitem [ref=e161]:
              - link "Données personnelles" [ref=e162] [cursor=pointer]:
                - /url: /cofolio/student/personal-data
            - listitem [ref=e163]:
              - link "Gestion des cookies" [ref=e164] [cursor=pointer]:
                - /url: /cofolio/student/cookies
        - generic [ref=e165]:
          - generic [ref=e166]: Autres sites
          - list [ref=e167]:
            - listitem [ref=e168]:
              - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e169] [cursor=pointer]:
                - /url: https://avenirs-esr.fr/
                - text: avenirs-esr.fr
        - generic [ref=e170]:
          - generic [ref=e171]: Partenaires
          - generic [ref=e172]:
            - link "Volet ESR du programme AVENIR(s) - Accueil" [ref=e173] [cursor=pointer]:
              - /url: https://avenirs-esr.fr/
              - img "Logo Avenir(s) ESR" [ref=e174]
            - link "Communauté d'établissements français d'enseignement supérieur pour l'innovation numérique - Accueil" [ref=e175] [cursor=pointer]:
              - /url: https://www.esup-portail.org/
              - img "Logo Esup Portail" [ref=e177]
    - link "@ESUP-Portail. Tous droits réservés. - Accueil" [ref=e181] [cursor=pointer]:
      - /url: https://www.esup-portail.org/
      - text: "@ESUP-Portail. Tous droits réservés."
```

# Test source

```ts
  87  |   @Then('the library activity tab is visible')
  88  |   async verifyActivityLibraryTabVisible () {
  89  |     await this.getActivityLibraryTab().isVisible()
  90  |   }
  91  | 
  92  |   @Then('library activity tab title is visible with positive count')
  93  |   async verifyActivityLibraryTitleWithPositiveCount () {
  94  |     await this.getActivityLibraryTab().verifyTitleWithPositiveCount()
  95  |   }
  96  | 
  97  |   @Then('the list of activity library elements is visible')
  98  |   async verifyActivityLibraryCardListVisible () {
  99  |     await this.getActivityLibraryTab().verifyCardListVisible()
  100 |   }
  101 | 
  102 |   @Then('the first page of activity does not exceed the selected page size')
  103 |   async verifyFirstPageCardsDoNotExceedPageSize () {
  104 |     await this.getActivityLibraryTab().verifyCardCountNotExceedsPageSize()
  105 |   }
  106 | 
  107 |   @Then('the first page of activity contains less than {int} activities')
  108 |   async verifyFirstPageCardsLessThan (maxCount: number) {
  109 |     await this.getActivityLibraryTab().verifyCardCountLessThan(maxCount)
  110 |   }
  111 | 
  112 |   @Then('the first activity card title is visible')
  113 |   async verifyFirstActivityCardTitleVisible () {
  114 |     await this.getActivityLibraryTab().getCardByIndex(0).verifyTitleVisible()
  115 |   }
  116 | 
  117 |   @Then('the first activity card thematic badge is visible')
  118 |   async verifyFirstActivityCardThematicBadgeVisible () {
  119 |     await this.getActivityLibraryTab().getCardByIndex(0).verifyThematicBadgeVisible()
  120 |   }
  121 | 
  122 |   @Then('the first activity card status badge is visible')
  123 |   async verifyFirstActivityCardStatusBadgeVisible () {
  124 |     await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadgeVisible()
  125 |   }
  126 | 
  127 |   @Then('the first activity card description is visible')
  128 |   async verifyFirstActivityCardDescriptionVisible () {
  129 |     await this.getActivityLibraryTab().getCardByIndex(0).verifySummaryVisible()
  130 |   }
  131 | 
  132 |   @Then('the first activity card description is hidden')
  133 |   async verifyFirstActivityCardDescriptionHidden () {
  134 |     await this.getActivityLibraryTab().getCardByIndex(0).verifySummaryHidden()
  135 |   }
  136 | 
  137 |   @Then('the first activity card status badge is hidden')
  138 |   async verifyFirstActivityCardStatusBadgeHidden () {
  139 |     await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadgeHidden()
  140 |   }
  141 | 
  142 |   @Then('the first activity card period badge is hidden')
  143 |   async verifyFirstActivityCardPeriodBadgeHidden () {
  144 |     await this.getActivityLibraryTab().getCardByIndex(0).verifyPeriodBadgeHidden()
  145 |   }
  146 | 
  147 |   @Then('the first activity card spans full width')
  148 |   async verifyFirstActivityCardFullWidth () {
  149 |     await this.verifyLocatorIsFullWidth(this.getActivityLibraryTab().getCards().first())
  150 |   }
  151 | 
  152 |   @Then('the activity library page contains elements')
  153 |   async verifyActivityLibraryPageNotEmpty () {
  154 |     await this.getActivityLibraryTab().verifyCardsNotEmpty()
  155 |   }
  156 | 
  157 |   @When('the user opens the unsubscribe activities modal')
  158 |   async openUnsubscribeActivitiesModal () {
  159 |     this.unsubscribedActivityId = await this.getActivityLibraryTab().getCardByIndex(1).getActivityId()
  160 |     this.unsubscribedActivityThematic = await this.getActivityLibraryTab().getCardByIndex(1).getActivityThematic()
  161 |     await this.getActivityLibraryTab().getDropdown().clickUnsubscribe()
  162 |   }
  163 | 
  164 |   @When('the user selects the last activity in the unsubscribe modal')
  165 |   async selectFirstActivityInUnsubscribeModal () {
  166 |     const modal = this.getActivityLibraryTab().getUnsubscribeModal()
  167 | 
  168 |     this.unsubscribedActivityId = await modal.getLastActivityId()
  169 |     this.unsubscribedActivityThematic = await modal.getLastActivityThematic()
  170 | 
  171 |     await modal.selectLastActivityItem()
  172 |   }
  173 | 
  174 |   @When('the user confirms the unsubscription')
  175 |   async confirmUnsubscription () {
  176 |     await this.getActivityLibraryTab().getUnsubscribeModal().clickConfirm()
  177 |   }
  178 | 
  179 |   @Then('unsubscription confirmation modal is visible')
  180 |   async verifyUnsubscribeSuccessMessageVisible () {
  181 |     await this.getActivityLibraryTab().getUnsubscribeModal().getConfirmModal().verifyVisible()
  182 |   }
  183 | 
  184 |   @When('the student clicks the first library activity card')
  185 |   async clickFirstLibraryActivityCard () {
  186 |     await this.getActivityLibraryTab().clickFirstCard()
> 187 |     await this.page.waitForURL(new RegExp(STUDENT_ROUTES.ACTIVITY_DETAIL.replace(':id', '.+')))
      |                     ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  188 |   }
  189 | 
  190 |   @Then('the first new activity card title is visible')
  191 |   async verifyFirstNewActivityCardTitleVisible () {
  192 |     await this.getAllActivitiesTabs().getNewCardByIndex(0).verifyTitleVisible()
  193 |   }
  194 | 
  195 |   @Then('the first new activity card thematic badge is visible')
  196 |   async verifyFirstNewActivityCardThematicBadgeVisible () {
  197 |     await this.getAllActivitiesTabs().getNewCardByIndex(0).verifyThematicBadgeVisible()
  198 |   }
  199 | 
  200 |   @Then('the first new activity card description is visible')
  201 |   async verifyFirstNewActivityCardDescriptionVisible () {
  202 |     await this.getAllActivitiesTabs().getNewCardByIndex(0).verifySummaryVisible()
  203 |   }
  204 | 
  205 |   @Then('the first all activity card title is visible')
  206 |   async verifyFirstAllActivityCardTitleVisible () {
  207 |     await this.getAllActivitiesTabs().getAllCardByIndex(0).verifyTitleVisible()
  208 |   }
  209 | 
  210 |   @Then('the first all activity card thematic badge is visible')
  211 |   async verifyFirstAllActivityCardThematicBadgeVisible () {
  212 |     await this.getAllActivitiesTabs().getAllCardByIndex(0).verifyThematicBadgeVisible()
  213 |   }
  214 | 
  215 |   @Then('the first all activity card description is visible')
  216 |   async verifyFirstAllActivityCardDescriptionVisible () {
  217 |     await this.getAllActivitiesTabs().getAllCardByIndex(0).verifySummaryVisible()
  218 |   }
  219 | 
  220 |   @When('the student clicks a library activity card with not in progress status')
  221 |   async clickLibraryActivityCardWithNotInProgressStatus () {
  222 |     await this.getActivityLibraryTab().clickCardWithNotInProgressStatus()
  223 |     await this.page.waitForURL(new RegExp(STUDENT_ROUTES.ACTIVITY_DETAIL.replace(':id', '.+')))
  224 |   }
  225 | 
  226 |   @When('the student clicks a library activity card with {string} status')
  227 |   async clickLibraryActivityCardWithStatus (status: string) {
  228 |     await this.getActivityLibraryTab().clickCardWithStatus(status)
  229 |     await this.page.waitForURL(new RegExp(STUDENT_ROUTES.ACTIVITY_DETAIL.replace(':id', '.+')))
  230 |   }
  231 | 
  232 |   @When('the student selects {int} results per page in activity library')
  233 |   async selectActivityLibraryPageSize (pageSize: number) {
  234 |     await this.getActivityLibraryTab().selectPageSize(pageSize)
  235 |   }
  236 | 
  237 |   @When('the student clicks an in progress activity without received feedbacks')
  238 |   async clickInProgressActivityWithoutReceivedFeedbacks () {
  239 |     await this.page.goto(STUDENT_ROUTES.ACTIVITIES)
  240 |     await this.clickActivityLibraryTabItem()
  241 |     await this.getActivityLibraryTab().selectPageSize(12)
  242 | 
  243 |     await this.getActivityLibraryTab().clickCardByActivityId(
  244 |       StudentActivitiesPage.ACTIVITY_ID_WITHOUT_RECEIVED_FEEDBACKS
  245 |     )
  246 | 
  247 |     await this.page.waitForURL(new RegExp(STUDENT_ROUTES.ACTIVITY_DETAIL.replace(':id', '.+')))
  248 |   }
  249 | 
  250 |   @When('the student clicks an in progress activity with associated traces')
  251 |   async clickInProgressActivityWithAssociatedTraces () {
  252 |     await this.getActivityLibraryTab().clickCardByActivityId(
  253 |       StudentActivitiesPage.ACTIVITY_ID_WITH_ASSOCIATED_TRACES
  254 |     )
  255 | 
  256 |     await this.page.waitForURL(new RegExp(STUDENT_ROUTES.ACTIVITY_DETAIL.replace(':id', '.+')))
  257 |   }
  258 | }
  259 | 
```