<script setup lang="ts">
import AvAlert from '@/ui/feedback/AvAlert/AvAlert.vue'

/**
 * Représente un message affiché dans le système de notifications (toaster).
 */
export interface Message {
  /**
   * Identifiant unique du message.
   * Peut être utilisé pour le suivi ou la suppression du message.
   */
  id?: string

  /**
   * Titre du message.
   * Optionnel, affiché en en-tête du message.
   */
  title?: string

  /**
   * Description détaillée du message.
   * Ce champ est obligatoire et contient le texte principal à afficher.
   */
  description: string

  /**
   * Type de message à afficher.
   * Définit le style et l'icône associés au message.
   * Les valeurs possibles sont :
   * - 'info' : Information générale
   * - 'success' : Message de succès
   * - 'warning' : Message d'avertissement
   * - 'error' : Message d'erreur
   */
  type: 'info' | 'success' | 'warning' | 'error'

  /**
   * Indique si le message peut être fermé manuellement par l'utilisateur.
   */
  closeable?: boolean

  /**
   * Balise HTML utilisée pour le titre du message.
   * Peut être utilisée pour ajuster la hiérarchie sémantique du titre.
   * Les valeurs possibles sont : 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'.
   */
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /**
   * Temps d'affichage du message en millisecondes avant sa fermeture automatique.
   * Si non défini, le message restera affiché jusqu'à une fermeture manuelle ou autre action.
   */
  timeout?: number
}

/**
 * Props du composant AvToaster.
 * Permet l'affichage et la gestion des messages de notification.
 */
interface AvToasterProps {
  /**
   * Liste des messages à afficher dans le toaster.
   * Chaque message doit suivre la structure définie par l'interface Message.
   */
  messages: Message[]

  /**
   * Fonction appelée pour supprimer un message du toaster.
   * @param id L'identifiant du message à supprimer.
   */
  onRemoveMessage: (id: string) => void
}

const { messages, onRemoveMessage } = defineProps<AvToasterProps>()

function getToasterClass (type: Message['type']) {
  return `av-toaster--${type} av-toaster--icon`
}

function getToasterStyleVars (type: Message['type']) {
  switch (type) {
    case 'error':
      return { '--icon-path': 'url(/assets/icons/alert-circle-outline.svg)' }
    case 'success':
      return { '--icon-path': 'url(/assets/icons/check-cricle.svg)' }
    case 'warning':
      return { '--icon-path': 'url(/assets/icons/warning-outline.svg)' }
    case 'info':
      return { '--icon-path': 'url(/assets/icons/message-badge.svg)' }
  }
}
</script>

<template>
  <div class="toaster-container">
    <TransitionGroup
      mode="out-in"
      name="list"
      tag="div"
      class="toasters"
    >
      <AvAlert
        v-for="message in messages"
        :key="message.id"
        class="av-toaster"
        :class="getToasterClass(message.type)"
        v-bind="message"
        :style="getToasterStyleVars(message.type)"
        @close="onRemoveMessage(message.id!)"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toaster-container {
  pointer-events: none;
  position: fixed;
  bottom: 1rem;
  width: 100%;
  z-index: 1750;
}

.toasters {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.av-toaster {
  width: 90%;
  pointer-events: all;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: fixed;
}
</style>
