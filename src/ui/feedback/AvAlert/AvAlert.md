# Alertes - `AvAlert`

## 🌟 Introduction

Le composant `AvAlert` est une adaptation du code de `DsfrAlert`. Il a pour vocation à être utilisé dans le composant `AvToaster`.

Les alertes permettent d’attirer l’attention de l’utilisateur sur une information sans interrompre sa tâche en cours.

L’alerte est disponible en deux tailles :

- taille médium (MD, par défaut, si la prop `small` est absente ou à `false`) et
- petite taille ‘SM’ si la prop `small` est à `true`.

🏅 La documentation sur le `DsfrAlert` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrAlert)

## 📐 Structure

L’alerte est composée des éléments suivants :

- un titre (prop `title`, de type `string`) :
  - obligatoire sur la version MD (si la prop `small` est absente ou à `false`),
  - optionnel sur la version SM (si la prop `small` est à `true`).
- un pictogramme et une couleur déterminés par la prop `type` qui peut valoir une des chaînes suivantes :
  - `'info'` (valeur par défaut si la prop `type` est absente)
  - `'success'`
  - `'warning'`
  - `'error'`
- un texte de description (avec la prop `description`, de type `string`) :
  - optionnel sur la version MD
  - obligatoire sur la version SM
  - le `slot` par défaut peut être utilisé
- une croix de fermeture si la prop `closeable` est à `true`

Autres props :

- `closed` sert à indiquer si l’alerte doit être présente (`false`) ou non (`true`) dans le DOM.
- `titleTag` permet d’indiquer la balise à utiliser pour le `title` : il s’agit de `h3` par défaut, cependant, pour passer les tests RGAA, il faut que les niveaux de titres se suivent et soient cohérents (par exemple, si sur la page il n’y a pas de `<h2>`, il faut passer `'h2'` comme valeur à la prop `titleTag` pour que le titre de la modal soit un `<h2>`).
- `closeButtonLabel` permet d'indiquer le libellé et l'aria-label du bouton de fermeture de l’alerte. Par défaut, la valeur est `Fermer`.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `crypto.randomUUID()` | | L'identifiant de l'alerte. |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | | Le type de l'alerte, influence sa couleur et l'icône associée. |
| `title` | `string` | `''` | | Le titre de l'alerte. |
| `description` | `string` | `undefined` | | Le texte de description de l'alerte. |
| `titleTag` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h3'` | | La balise à utiliser pour le titre de l'alerte. |
| `small` | `boolean` | `false` | | Indique si l’alerte doit être en version MD (`false`) ou SM (`true`). |
| `closed` | `boolean` | `false` | | Indique si l’alerte doit être présente (`false`) ou non (`true`) dans le DOM. |
| `closeable` | `boolean` | `false` | | Indique si le bouton de fermeture doit être présent (`true`) ou non (`false`) dans l'alerte. |
| `closeButtonLabel` | `string` | `'Fermer'` | | Le libellé et l'aria-label du bouton de fermeture de l’alerte. |
| `alert` | `boolean` | `false` | | Indique si l’alerte doit avoir le rôle `alert` (`true`) ou non (`false`). |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'close'` | | Événement déclenché à la fermeture de l'alerte |

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `default` | Slot par défaut pour la description de l'alerte. |
