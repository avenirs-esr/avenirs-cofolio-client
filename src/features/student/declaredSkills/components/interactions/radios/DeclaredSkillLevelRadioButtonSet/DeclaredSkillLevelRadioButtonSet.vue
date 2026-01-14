<script setup lang="ts">
import { EDeclaredSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'
import { useAdditionalSkillConfig } from '@/features/student/declaredSkills/queries/use-skills-config.query/use-skills-config.query'
import { AvRadioButton, AvRadioButtonSet } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface DeclaredSkillLevelRadioButtonSetProps {
  legend?: string
  errorMessage?: string
  name?: string
}

const { name = 'skillLevel' } = defineProps<DeclaredSkillLevelRadioButtonSetProps>()

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<EDeclaredSkillLevel | ''>()

const { t } = useI18n()
const { data: skillConfig } = useAdditionalSkillConfig()

const skillLevels = computed(() => Object.values(EDeclaredSkillLevel))

const defaultLegend = computed(() =>
  t('student.declaredSkills.interactions.radios.DeclaredSkillLevelRadioButtonSet.legend')
)

function getDescription (level: EDeclaredSkillLevel) {
  if (!skillConfig.value) {
    return level
  }
  return isEnumMember(EDeclaredSkillLevel, level) ? skillConfig.value[level]?.description ?? level : ''
}

function handleUpdateModelValue (value: unknown) {
  if (typeof value === 'string' && isEnumMember(EDeclaredSkillLevel, value)) {
    modelValue.value = value
  }
}
</script>

<template>
  <div
    v-if="skillConfig"
    class="skill-level-field"
  >
    <AvRadioButtonSet
      :model-value="modelValue"
      :legend="legend ?? defaultLegend"
      :error-message="errorMessage"
      :name="name"
      @update:model-value="handleUpdateModelValue"
      @blur="emit('blur')"
    >
      <template
        v-for="level in skillLevels"
        :key="level"
      >
        <AvRadioButton :value="level">
          <div class="level-option">
            <div class="level-option__header">
              <DeclaredSkillLevelBadge :level="level" />
            </div>
            <span class="b2-regular">
              {{ getDescription(level) }}
            </span>
          </div>
        </AvRadioButton>
      </template>
    </AvRadioButtonSet>
  </div>
</template>

<style scoped lang="scss">
.skill-level-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.level-option {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.level-option__header {
  display: flex;
  align-items: center;
}
</style>
