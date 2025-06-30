# En-tête - `AvHeader`

## 🌟 Introduction

Le composant `AvHeader` est une adaptation du code de `DsfrHeader`.

C'est un composant d'en-tête ultra-flexible. Il intègre une barre de recherche et des liens rapides. Il permet également l'ajout d'une navigation principale dans le slot `mainnav` et d'un sélecteur de langage par le bias de la prop `language-selector`.

🏅 La documentation sur le `DsfrHeader` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrHeader)

## 📐 Structure

L’en-tête est composé :

- du bloc Marque Cofolio.
- du nom de service.
- d’une ‘baseline’ (description) sous le nom de site.
- d’une partie fonctionnelle optionnelle - proposant des **accès rapides** et/ou une barre de recherche et/ou un sélecteur de langue - adaptée aux besoins particuliers de chaque site.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `searchbarId` | `string` | `'searchbar-header'` | | Valeur de l’attribut `id` de l’input de la searchbar. |
| `serviceTitle` | `string` | `undefined` | | Titre du service affiché dans l'en-tête. |
| `serviceDescription` | `string` | `undefined` | | Description courte du service. |
| `homeTo` | `string \| RouteLocationRaw` | `'/'` | | Lien de la page d'accueil. |
| `logoText` | `string \| string[]` | `() => 'Gouvernement'` | | Texte ou texte alternatif du logo. |
| `modelValue` | `string` | `''` | | Valeur pour la barre de recherche. |
| `placeholder` | `string` | `'Rechercher...'` | | Placeholder pour la barre de recherche. |
| `quickLinks` | `DsfrHeaderMenuLinkProps[]` | `() => []` | | Liens rapides à afficher dans l'en-tête. |
| `languageSelector` | `DsfrLanguageSelectorProps` | `undefined` | | Liens rapides à afficher dans l'en-tête. |
| `searchLabel` | `string` | `'Recherche'` | | Label pour la barre de recherche. |
| `quickLinksAriaLabel` | `string` | `'Menu secondaire'` | | Label ARIA pour les liens rapides. |
| `showSearch` | `boolean` | `false` | | Affiche ou non la barre de recherche. |
| `showSearchLabel` | `string` | `'Recherche'` | | Label du bouton pour afficher la recherche. |
| `menuLabel` | `string` | `'Menu'` | | Label du menu. |
| `menuModalLabel` | `string` | `'Menu'` | | Label du menu en mode modal. |
| `closeMenuModalLabel` | `string` | `'Fermer'` | | Label du bouton de fermeture du menu en mode modal. |
| `homeLabel` | `string` | `'Accueil'` | | Label de l'accueil composant le titre du lien présentant le service. |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'update:modelValue'` | Contenu (`string`) du champ de saisie pour la recherche | Émis lors de la mise à jour de la barre de recherche. |
| `'search'` | Contenu (`string`) du champ de saisie pour la recherche | Émis lorsqu’une recherche est effectuée. |
| `'languageSelect'` | Contenu (`DsfrLanguageSelectorElement`) de la langue sélectionnée | Émis lorsque l’utilisateur change la langue du site. |

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `before-quick-links` | Slot pour ajouter du contenu avant les liens rapides. |
| `after-quick-links` | Slot pour ajouter du contenu après les liens rapides. |
| `mainnav` | Slot pour le menu de navigation principal. |
| `default` | Slot par défaut pour le contenu supplémentaire dans l'en-tête. |

## 📝 Exemples d'utilisation

```vue
<script setup lang="ts">
const { languageSelector, selectLanguage } = useLanguageSwitcher()
const searchQuery = ref('')
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    service-title="Cofolio Étudiant"
    home-to="/student"
    show-search
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #before-quick-links>
      <ul class="fr-btns-group">
        <li>
          <StudentMailboxPopover />
        </li>
        <li>
          <StudentNotificationsPopover />
        </li>
        <li>
          <StudentProfilePopover />
        </li>
      </ul>
    </template>
    <template #mainnav>
      <StudentNavigation />
    </template>
  </AvHeader>
</template>
```
