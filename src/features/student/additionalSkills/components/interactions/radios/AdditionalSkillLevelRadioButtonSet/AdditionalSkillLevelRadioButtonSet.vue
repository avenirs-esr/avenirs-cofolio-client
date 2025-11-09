<script setup lang="ts">
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import AdditionalSkillLevelBadge from '@/features/student/additionalSkills/components/badges/AdditionalSkillLevelBadge/AdditionalSkillLevelBadge.vue'
import { useAdditionalSkillConfig } from '@/features/student/queries'
import { AvRadioButton, AvRadioButtonSet } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface AdditionalSkillLevelRadioButtonSetProps {
  legend?: string
  errorMessage?: string
  name?: string
}

const { name = 'skillLevel' } = defineProps<AdditionalSkillLevelRadioButtonSetProps>()

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<EAdditionalSkillLevel | ''>()

const { t } = useI18n()
const { data: skillConfig } = useAdditionalSkillConfig()

const skillLevels = computed(() => Object.values(EAdditionalSkillLevel))

const defaultLegend = computed(() =>
  t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.levelLabel')
)

function getDescription (level: EAdditionalSkillLevel) {
  if (!skillConfig.value) {
    return level
  }
  return isEnumMember(EAdditionalSkillLevel, level) ? skillConfig.value[level]?.description ?? level : ''
}

function handleUpdateModelValue (value: unknown) {
  if (typeof value === 'string' && isEnumMember(EAdditionalSkillLevel, value)) {
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
              <AdditionalSkillLevelBadge :level="level" />
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
@use "@avenirs-esr/avenirs-dsav/src/styles/main.scss" as ds;

.skill-level-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

:deep(.fr-fieldset__legend--regular) {
  @extend .caption-regular;
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
