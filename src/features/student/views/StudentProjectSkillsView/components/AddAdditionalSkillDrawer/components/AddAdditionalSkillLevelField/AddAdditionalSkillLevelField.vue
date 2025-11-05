<script setup lang="ts">
import type {
  AdditionalSkillForm
} from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import type {
  UpdateAdditionalSkillForm
} from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import { AdditionalSkillLevelBadge } from '@/features/student/components/badges'
import { useAdditionalSkillConfig } from '@/features/student/queries'
import { AvRadioButton, AvRadioButtonSet } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface SkillLevelFieldProps {
  form: AdditionalSkillForm | UpdateAdditionalSkillForm
}

const { form } = defineProps<SkillLevelFieldProps>()
const FormField = form.Field

const { t } = useI18n()
const { data: skillConfig } = useAdditionalSkillConfig()

const skillLevels = computed(() => Object.values(EAdditionalSkillLevel))

function getDescription (level: EAdditionalSkillLevel) {
  if (!skillConfig.value) {
    return level
  }
  return isEnumMember(EAdditionalSkillLevel, level) ? skillConfig.value[level]?.description ?? level : ''
}
</script>

<template>
  <div
    v-if="skillConfig"
    class="skill-level-field"
  >
    <FormField name="level">
      <template #default="{ field }">
        <AvRadioButtonSet
          :model-value="field.state.value"
          :legend="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.levelLabel')"
          :error-message="field.state.meta.errors?.join(', ')"
          name="skillLevel"
          @update:model-value="(value) => {
            if (typeof value === 'string' && isEnumMember(EAdditionalSkillLevel, value)) {
              field.handleChange(value)
            }
          }"
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
      </template>
    </FormField>
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
