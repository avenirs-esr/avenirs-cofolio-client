<script lang="ts" setup>
import { useModal } from '@/common/composables'
import ActivityAssociateElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.vue'
import DeleteActivityAssociatedElementsDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import AssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import DeleteActivityAssociatedSkillsModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedSkillsModal/DeleteActivityAssociatedSkillsModal.vue'
import DeleteActivityAssociatedTracesModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.vue'

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showTracesModal, displayModal: displayTracesModal, hideModal: hideTracesModal } = useModal()
const { showModal: showAssociateTracesModal, displayModal: displayAssociateTracesModal, hideModal: hideAssociateTracesModal } = useModal()
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteActivityAssociatedElementsDropdown
        @skills-selected="displaySkillsModal"
        @traces-selected="displayTracesModal"
      />
      <ActivityAssociateElementsDropdown
        @traces-selected="displayAssociateTracesModal"
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

  <AssociateTracesModal
    :show="showAssociateTracesModal"
    @cancel="hideAssociateTracesModal"
    @associated="hideAssociateTracesModal"
  />
</template>
