<script lang="ts" setup>
import { useModal } from '@/common/composables'
import DeleteAssociatedElementsDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteAssociatedElementsDropdown/DeleteAssociatedElementsDropdown.vue'
import DeleteAssociatedSkillsModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteAssociatedSkillsModal/DeleteAssociatedSkillsModal.vue'
import DeleteAssociatedTracesModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteAssociatedTracesModal/DeleteAssociatedTracesModal.vue'

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showTracesModal, displayModal: displayTracesModal, hideModal: hideTracesModal } = useModal()
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteAssociatedElementsDropdown
        @skills-selected="displaySkillsModal"
        @traces-selected="displayTracesModal"
      />
    </div>
  </div>

  <DeleteAssociatedSkillsModal
    :show="showSkillsModal"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteAssociatedTracesModal
    :show="showTracesModal"
    @cancel="hideTracesModal"
    @deleted="hideTracesModal"
  />
</template>
