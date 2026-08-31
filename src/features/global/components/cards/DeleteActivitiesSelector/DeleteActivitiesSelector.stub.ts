import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteActivitiesSelectorStub = defineComponent({
  name: 'DeleteActivitiesSelectorStub',
  props: {
    associations: { type: Array as PropType<DeclaredActivityAssociationDTO[]>, required: true },
    readonly: { type: Boolean, default: false },
    modelValue: { type: Array as PropType<string[]>, default: () => [] }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="delete-activities-selector-stub">
      <div v-for="association in associations" :key="association.associationId">
        <a
          v-if="!readonly"
          role="button"
          data-testid="delete-activities-selector-item"
          :data-association-id="association.associationId"
          :data-status="association.declaredActivity.status"
          @click="$emit('update:modelValue', [association.associationId])"
        >
          {{ association.declaredActivity.title }}
        </a>
      </div>
    </div>
  `
})
