<script setup lang="ts">
import { EDeclaredSkillLevel, useGetAdditionalSkillConfig } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'
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
const { data: skillConfig } = useGetAdditionalSkillConfig()

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
    class="av-col av-gap-sm av-mt-sm"
    data-testid="skill-level-field"
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
          <div
            class="av-col av-gap-xxs"
            data-testid="level-option"
          >
            <DeclaredSkillLevelBadge :level="level" />
            <span class="b2-regular">
              {{ getDescription(level) }}
            </span>
          </div>
        </AvRadioButton>
      </template>
    </AvRadioButtonSet>
  </div>
</template>
