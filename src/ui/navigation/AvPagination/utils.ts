import type { Page } from '@gouvminint/vue-dsfr'
import type { Ref } from 'vue'

/**
 * Génère un tableau de pages pour la pagination en fonction du nombre total de pages.
 *
 * Chaque page est un objet contenant :
 * - `title`: Le numéro de la page en chaîne de caractères.
 * - `label`: Le label affiché pour la page (identique au numéro).
 * - `href`: Un identifiant d'ancrage vers la page, formaté en `#page-x`.
 *
 * @param {Ref<number>} totalPages - Référence réactive au nombre total de pages.
 * @returns {Page[]} Tableau des objets pages à utiliser pour la pagination.
 */
export function getPaginationPages (totalPages: Ref<number>): Page[] {
  return Array.from({ length: totalPages.value }, (_, index) => {
    const pageNum = index + 1
    return {
      title: `${pageNum}`,
      label: `${pageNum}`,
      href: `#page-${pageNum}`,
    }
  })
}
