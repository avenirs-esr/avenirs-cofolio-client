<script lang="ts" setup>
import { useModal } from '@/common/composables'
import DeleteActivityAssociatedElementsDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import DeleteActivityAssociatedSkillsModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedSkillsModal/DeleteActivityAssociatedSkillsModal.vue'
import DeleteActivityAssociatedTracesModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.vue'

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showTracesModal, displayModal: displayTracesModal, hideModal: hideTracesModal } = useModal()
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteActivityAssociatedElementsDropdown
        @skills-selected="displaySkillsModal"
        @traces-selected="displayTracesModal"
      />
    </div>
  </div>

  <DeleteActivityAssociatedSkillsModal
    :show="showSkillsModal"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteActivityAssociatedTracesModal
    :show="showTracesModal"
    @cancel="hideTracesModal"
    @deleted="hideTracesModal"
  />
</template>
