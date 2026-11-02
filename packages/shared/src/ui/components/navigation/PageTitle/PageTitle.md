# PageTitle

En-tête de page avec fil d’Ariane, titre, infobulle facultative et actions. Le composant appartient à la catégorie `navigation`, car il présente la position de la page dans la navigation de l’application.

## API publique

`PageTitle`, `PageTitleProps`, `PageTitleStub`, `useBreadcrumb`, `BreadcrumbLinkRaw` et `MetaBreadcrumb` sont exportés depuis `@avenirs-esr/shared`.

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `title` | `string` | Obligatoire | Titre affiché dans un `h1` en l’absence du slot `title`. |
| `trailingLinks` | `AvBreadcrumbProps['links']` | `[]` | Entrées ajoutées après celles de la route. |
| `informationTooltip` | `string` | — | Contenu de l’infobulle affichée à côté du titre. |

| Slot | Description |
| --- | --- |
| `title` | Remplace le titre par défaut. |
| `actions` | Affiche les actions à droite du titre. |

## Fil d’Ariane

`useBreadcrumb` lit `route.meta.breadcrumb`, qui accepte une entrée `BreadcrumbLinkRaw` ou un tableau d’entrées. Chaque entrée contient une clé de traduction `textKey` et une destination `to` facultative. Cette destination peut être une valeur Vue Router ou une fonction recevant la route courante.

Le composable retourne `breadcrumbLinks`, un tableau calculé réactif. Son paramètre facultatif est un getter retournant les entrées finales. Les entrées de route sont traduites avec l’instance i18n de l’application ; leurs destinations sont résolues avec la route courante. La destination de la dernière entrée est supprimée pour la rendre non cliquable.

Shared définit le type de `RouteMeta.breadcrumb`. Les applications conservent leurs routes, leurs clés de traduction métier et leurs autres métadonnées de navigation.

## Traductions

Shared est la source de vérité pour `global.breadcrumb.ariaLabel` et `global.breadcrumb.expandButtonLabel`, en français et en anglais. Ces clés ne sont pas redéfinies dans les dictionnaires applicatifs. Le composant utilise l’instance i18n existante de l’application.

## Tests

Les tests unitaires du composant et du composable sont co-localisés dans shared. Le stub conserve les props `title` et `trailingLinks`, les slots `title` et `actions`, ainsi que la transmission des attributs.
