# QuerySuspense

Composant de suspension pour les requêtes TanStack Query. Gère les états de chargement, d'erreur et de liste vide de façon déclarative.

## Utilisation avec TanStack Query

```vue
<script setup lang="ts">
import { QuerySuspense } from '@avenirs-esr/shared'
import { useMyQuery } from '@/queries/use-my.query/use-my.query'

const { data, error, isLoading } = useMyQuery()
const isEmpty = computed(() => !data.value?.length)
</script>

<template>
  <QuerySuspense
    :error="error"
    :is-loading="isLoading"
    :is-empty="isEmpty"
  >
    <MyList :items="data" />
  </QuerySuspense>
</template>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `isEmpty` | `boolean` | `undefined` | Liste vide après le chargement |
| `isLoading` | `boolean` | `false` | Affiche le spinner pendant le chargement |
| `preserveContent` | `boolean` | `false` | Conserve le contenu pendant le chargement et affiche un indicateur flottant |
| `error` | `BaseApiException \| null` | `null` | Erreur retournée par la query |
| `errorTitle` | `string` | `"Une erreur est survenue lors du chargement des données"` | Titre du message d'erreur |
| `errorDescription` | `string` | Traduction du code API, sinon `global.error.generic` | Description du message d'erreur |
| `emptyStateMessage` | `string` | `"Aucune donnée à afficher"` | Message de l'état vide |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Contenu affiché quand il n'y a pas d'erreur et que la liste n'est pas vide |
| `error` | Remplace le `ErrorMessage` par défaut |
| `empty` | Remplace le `EmptyState` par défaut |

## Personnalisation des slots

```vue
<QuerySuspense :error="error" :is-loading="isLoading" :is-empty="isEmpty">
  <template #error>
    <MonErreurPersonnalisee />
  </template>
  <template #empty>
    <MonEtatVidePersonnalise />
  </template>
  <MaListe :items="data" />
</QuerySuspense>
```

## Catégorie et traductions

Le composant appartient à `ui/components/containers` : il orchestre le contenu et ses états asynchrones à partir de `Loader`, `ErrorMessage` et `EmptyState`.

Il utilise l’instance vue-i18n fournie par l’application et les messages partagés sous `global.components.QuerySuspense`. Toutes les traductions des codes API de `useApiErrors` sont centralisées sous `global.error.api`, avec le message de repli sous `global.error.generic`. Shared est la source de vérité pour ces traductions : les dictionnaires applicatifs ne les redéfinissent pas. Les messages partagés sont fusionnés avant les messages applicatifs.

Le composant, son type `QuerySuspenseProps` et son stub `QuerySuspenseStub` sont exportés depuis `@avenirs-esr/shared`.
