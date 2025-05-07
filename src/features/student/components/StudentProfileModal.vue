<script setup lang="ts">
import { AvButton, AvModal, MDI_ICONS } from '@/ui'

const {
  showModal,
  onClose,
} = defineProps<{ showModal: boolean, onClose: () => void }>()
</script>

<template>
  <AvModal
    title=""
    :opened="showModal"
    @close="onClose"
  >
    <ul>
      <li>
        <AvButton
          label="Modifier mon profil"
          :icon="MDI_ICONS.PENCIL"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          label="Voir mon agenda"
          :icon="MDI_ICONS.CALENDAR_MONTH"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          label="Aller sur mon ENT"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          label="Aller sur le passeport de compétence"
          :icon="MDI_ICONS.ARROW_TOP_RIGHT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
      <li>
        <AvButton
          label="Me déconnecter"
          :icon="MDI_ICONS.LOGOUT"
          variant="tertiary-no-outline"
          color="--foregroud-text1"
        />
      </li>
    </ul>
  </AvModal>
</template>

<style lang="scss" scoped>
ul {
  list-style-type:none;
  padding: 0;
  margin: 0;
}
</style>
