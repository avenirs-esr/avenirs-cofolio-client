<script setup lang="ts">
import Card from '@/common/components/cards/Card/Card.vue'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import UpdateHandleSelector from '@/common/components/VueFlow/UpdateHandleSelector/UpdateHandleSelector.vue'
import { AvIcon, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { type NodeProps, Position, useVueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

export interface UpdateHandlesModalProps extends Pick<NodeProps, 'id' | 'data'> {
  show: boolean
}

const { id, data, show } = defineProps<UpdateHandlesModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { updateNode } = useVueFlow()
const { isMobile } = useAvBreakpoints()

const topModelValue = ref<boolean | undefined>(data.top)
const rightModelValue = ref<boolean | undefined>(data.right)
const bottomModelValue = ref<boolean | undefined>(data.bottom)
const leftModelValue = ref<boolean | undefined>(data.left)

function onConfirm () {
  updateNode(id, {
    data: {
      ...data,
      top: topModelValue.value,
      right: rightModelValue.value,
      bottom: bottomModelValue.value,
      left: leftModelValue.value
    }
  })
  emit('close')
}

function getIconVisibility (handleType: boolean | undefined) {
  return handleType === true
}

const handleIcons = [
  { position: Position.Top, modelValue: topModelValue },
  { position: Position.Right, modelValue: rightModelValue },
  { position: Position.Bottom, modelValue: bottomModelValue },
  { position: Position.Left, modelValue: leftModelValue }
]
</script>

<template>
  <ConfirmationModal
    :show="show"
    @close="$emit('close')"
    @confirm="onConfirm"
  >
    <template #header>
      <div class="av-row av-row--center">
        <span class="b2-bold">{{ t('global.vueFlow.UpdateHandlesModal.title') }}</span>
      </div>
    </template>
    <div class="av-flex-col-sm">
      <UpdateHandleSelector
        :model-value="topModelValue"
        :position="Position.Top"
        @update:model-value="(value) => topModelValue = value"
      />

      <div class="av-flex-row-sm av-row--middle av-row av-row--center">
        <UpdateHandleSelector
          v-model="leftModelValue"
          :position="Position.Left"
        />

        <div class="handles-container">
          <div
            v-for="icon in handleIcons"
            :key="icon.position"
            :class="`${icon.position}-handle`"
          >
            <AvIcon
              v-if="getIconVisibility(icon.modelValue.value)"
              :name="MDI_ICONS.CIRCLE"
              color="var(--dark-background-primary1)"
            />
          </div>

          <Card>
            <template #title>
              <span class="b2-bold">{{ t('global.vueFlow.UpdateHandlesModal.preview') }}</span>
            </template>
            <div
              class="demo-card-content"
              :class="{ 'demo-card-content--mobile': isMobile }"
            />
          </Card>
        </div>

        <UpdateHandleSelector
          v-model="rightModelValue"
          :position="Position.Right"
        />
      </div>

      <UpdateHandleSelector
        v-model="bottomModelValue"
        :position="Position.Bottom"
      />
    </div>
  </ConfirmationModal>
</template>

<style lang="scss" scoped>
.demo-card-content {
  width: var(--dimension-8xl);

  &--mobile {
    width: var(--dimension-4xl);
  }
}

.handles-container {
  position: relative;
  height: 100%;

  .top-handle,
  .right-handle,
  .bottom-handle,
  .left-handle {
    position: absolute;
  }

  .top-handle {
    top: -0.5rem;
    left: calc(50% - 12px);
  }

  .right-handle {
    top: calc(50% - 12px);
    right: -0.5rem;
  }

  .bottom-handle {
    bottom: -0.5rem;
    left: calc(50% - 12px);
  }

  .left-handle {
    top: calc(50% - 12px);
    left: -0.5rem;
  }
}
</style>
