<!-- This code is an adaptation of the source code of DsfrHeader available at:
 https://vue-ds.fr/composants/DsfrHeader -->

<script lang="ts" setup>
import type { Slot } from 'vue'

import type { RouteLocationRaw } from 'vue-router'
import AvHeaderMenuLinks from '@/ui/header/AvHeaderMenuLinks/AvHeaderMenuLinks.vue'
import AvLogo from '@/ui/header/AvLogo.vue'
import {
  type DsfrHeaderMenuLinkProps,
  type DsfrLanguageSelectorElement,
  type DsfrLanguageSelectorProps,
  registerNavigationLinkKey
} from '@gouvminint/vue-dsfr'

/**
 * AvHeader component props.
 */
export interface AvHeaderProps {
/**
 * Value of the `id` attribute of the search bar input.
 * @default 'searchbar-header'
 */
  searchbarId?: string

  /**
   * Title of the service displayed in the header.
   */
  serviceTitle?: string

  /**
   * Short description of the service.
   */
  serviceDescription?: string

  /**
   * Homepage link.
   * @default '/'
   */
  homeTo?: string | RouteLocationRaw

  /**
   * Value related to the search bar (controlled template).
   * @default ''
   */
  modelValue?: string

  /**
   * Placeholder for the search bar.
   * @default 'Rechercher...'
   */
  placeholder?: string

  /**
   * Quick links to display in the header.
   * @default () => []
   */
  quickLinks?: DsfrHeaderMenuLinkProps[]

  /**
   * Language selector properties.
   */
  languageSelector?: DsfrLanguageSelectorProps

  /**
   * Label for the search bar.
   * @default 'Recherche'
   */
  searchLabel?: string

  /**
   * ARIA label for quick links.
   * @default 'Menu secondaire'
   */
  quickLinksAriaLabel?: string

  /**
   * Whether to display the search bar. * @default false
   */
  showSearch?: boolean

  /**
   * Label of the button to display the search bar.
   * @default 'Recherche'
   */
  showSearchLabel?: string

  /**
   * Label of the main menu.
   * @default 'Menu'
   */
  menuLabel?: string

  /**
   * Label of the menu in modal mode.
   * @default 'Menu'
   */
  menuModalLabel?: string

  /**
   * Label of the button to close the modal menu.
   * @default 'Fermer'
   */
  closeMenuModalLabel?: string

  /**
   * Label of the link to the home page (present in the service title).
   * @default 'Accueil'
   */
  homeLabel?: string
}

const props = withDefaults(defineProps<AvHeaderProps>(), {
  searchbarId: 'searchbar-header',
  languageSelector: undefined,
  serviceTitle: undefined,
  serviceDescription: undefined,
  homeTo: '/',
  modelValue: '',
  placeholder: 'Rechercher...',
  quickLinks: () => [],
  searchLabel: 'Recherche',
  quickLinksAriaLabel: 'Menu secondaire',
  showSearchLabel: 'Recherche',
  menuLabel: 'Menu',
  menuModalLabel: 'Menu',
  closeMenuModalLabel: 'Fermer',
  homeLabel: 'Accueil',
})

/**
 * Événements émis par le composant AvHeader.
 */
const emit = defineEmits<{
  /**
   * Événement émis lors de la mise à jour de la barre de recherche.
   * @event update:modelValue
   * @param payload Contenu du champ de saisie pour la recherche.
   */
  (e: 'update:modelValue', payload: string): void

  /**
   * Événement émis lorsqu'une recherche est effectuée.
   * @event search
   * @param payload Contenu du champ de saisie pour la recherche.
   */
  (e: 'search', payload: string): void

  /**
   * Événement émis lorsque l'utilisateur change la langue du site.
   * @event languageSelect
   * @param payload Langue sélectionnée.
   */
  (e: 'languageSelect', payload: DsfrLanguageSelectorElement): void
}>()

const slots = defineSlots<{
  /**
   * Slot pour ajouter du contenu avant les liens rapides.
   */
  'before-quick-links'?: Slot

  /**
   * Slot pour ajouter du contenu après les liens rapides.
   */
  'after-quick-links'?: Slot

  /**
   * Slot pour le menu de navigation principal.
   */
  'mainnav'?: Slot

  /**
   * Slot par défaut pour le contenu supplémentaire dans l'en-tête.
   */
  'default'?: Slot
}>()

const languageSelector = toRef(props, 'languageSelector')

const menuOpened = ref(false)
const searchModalOpened = ref(false)
const modalOpened = ref(false)

function hideModal () {
  modalOpened.value = false
  menuOpened.value = false
  searchModalOpened.value = false
  document.getElementById('button-menu')?.focus()
}

function onKeyDown (e: KeyboardEvent) {
  if (e.key === 'Escape') {
    hideModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})

function showMenu () {
  modalOpened.value = true
  menuOpened.value = true
  searchModalOpened.value = false
  // Sans le setTimeout, le focus n'est pas fait
  setTimeout(() => {
    document.getElementById('close-button')?.focus()
  })
}

function showSearchModal () {
  modalOpened.value = true
  menuOpened.value = false
  searchModalOpened.value = true
}
const onQuickLinkClick = hideModal

const title = computed(() => [props.homeLabel, props.serviceTitle].filter(x => x).join(' - '))

const isWithSlotNav = computed(() => Boolean(slots.mainnav))
provide(registerNavigationLinkKey, () => hideModal)
</script>

<template>
  <header
    role="banner"
    class="fr-header"
  >
    <div class="fr-header__body">
      <div class="fr-container  width-inherit">
        <div class="fr-header__body-row">
          <div class="fr-header__brand  fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <RouterLink
                  v-if="!serviceTitle"
                  :to="homeTo"
                  :title
                >
                  <AvLogo
                    data-testid="header-logo"
                  />
                </RouterLink>
                <AvLogo
                  v-else
                  data-testid="header-logo"
                />
              </div>
              <div
                v-if="showSearch || isWithSlotNav || quickLinks?.length"
                class="fr-header__navbar"
              >
                <button
                  v-if="showSearch"
                  class="fr-btn  fr-btn--search"
                  aria-controls="header-search"
                  :aria-label="showSearchLabel"
                  :title="showSearchLabel"
                  :data-fr-opened="searchModalOpened"
                  @click.prevent.stop="showSearchModal()"
                />
                <button
                  v-if="isWithSlotNav || quickLinks?.length"
                  id="button-menu"
                  class="fr-btn--menu  fr-btn"
                  :data-fr-opened="showMenu"
                  aria-controls="header-navigation"
                  aria-haspopup="dialog"
                  :aria-label="menuLabel"
                  :title="menuLabel"
                  data-testid="open-menu-btn"
                  @click.prevent.stop="showMenu()"
                />
              </div>
            </div>
            <div
              v-if="serviceTitle"
              class="fr-header__service"
            >
              <RouterLink
                :to="homeTo"
                :title
                v-bind="$attrs"
              >
                <p class="fr-header__service-title">
                  {{ serviceTitle }}
                </p>
              </RouterLink>
              <p
                v-if="serviceDescription"
                class="fr-header__service-tagline"
              >
                {{ serviceDescription }}
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <slot name="before-quick-links" />
              <AvHeaderMenuLinks
                v-if="!menuOpened"
                :links="quickLinks"
                :nav-aria-label="quickLinksAriaLabel"
              />
              <slot name="after-quick-links" />
              <template v-if="languageSelector">
                <DsfrLanguageSelector
                  v-bind="languageSelector"
                  @select="emit('languageSelect', $event)"
                />
              </template>
            </div>
            <div
              v-if="showSearch"
              class="fr-header__search  fr-modal"
            >
              <DsfrSearchBar
                :id="searchbarId"
                :label="searchLabel"
                :model-value="modelValue"
                :placeholder="placeholder"
                style="justify-content: flex-end"
                @update:model-value="emit('update:modelValue', $event)"
                @search="emit('search', $event)"
              />
            </div>
          </div>
        </div>
        <div
          v-if="showSearch || isWithSlotNav || (quickLinks && quickLinks.length) || languageSelector"
          id="header-navigation"
          class="fr-header__menu  fr-modal"
          :class="{ 'fr-modal--opened': modalOpened }"
          :aria-label="menuModalLabel"
          role="dialog"
          aria-modal="true"
        >
          <div class="fr-container">
            <button
              id="close-button"
              class="fr-btn fr-btn--close"
              aria-controls="header-navigation"
              data-testid="close-modal-btn"
              @click.prevent.stop="hideModal()"
            >
              {{ closeMenuModalLabel }}
            </button>
            <div class="fr-header__menu-links">
              <template v-if="languageSelector">
                <DsfrLanguageSelector
                  v-bind="languageSelector"
                  @select="languageSelector.currentLanguage = $event.codeIso"
                />
              </template>
              <slot name="before-quick-links" />
              <AvHeaderMenuLinks
                v-if="menuOpened"
                role="navigation"
                :links="quickLinks"
                :nav-aria-label="quickLinksAriaLabel"
                @link-click="onQuickLinkClick"
              />
              <slot name="after-quick-links" />
            </div>

            <template v-if="modalOpened">
              <slot
                name="mainnav"
                :hidemodal="hideModal"
              />
            </template>
            <div
              v-if="searchModalOpened"
              class="flex justify-center items-center"
            >
              <DsfrSearchBar
                :searchbar-id="searchbarId"
                :model-value="modelValue"
                :placeholder="placeholder"
                @update:model-value="emit('update:modelValue', $event)"
                @search="emit('search', $event)"
              />
            </div>
          </div>
        </div>
        <!-- @slot Slot par défaut pour le contenu du fieldset (sera dans `<div class="fr-header__body-row">`) -->
        <slot />
      </div>
    </div>
    <div class="fr-header__menu fr-modal">
      <div
        v-if="isWithSlotNav && !modalOpened"
        class="fr-container"
      >
        <!-- @slot Slot nommé mainnav pour le menu de navigation principal -->
        <slot
          name="mainnav"
          :hidemodal="hideModal"
        />
      </div>
    </div>
  </header>
</template>
