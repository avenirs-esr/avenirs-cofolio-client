<script setup lang="ts">
import type {
  AdditionalSkillForm
} from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import { useAdditionalSkillConfig } from '@/features/student/queries'
import { AvBadge, AvRadioButton, AvRadioButtonSet, ICONS_DATA_URL } from '@/ui'
import { useI18n } from 'vue-i18n'

interface SkillLevelFieldProps {
  form: AdditionalSkillForm
}

const props = defineProps<SkillLevelFieldProps>()
const form = props.form

const { t } = useI18n()
const { data: skillConfig } = useAdditionalSkillConfig()

const skillLevels = computed(() => Object.values(EAdditionalSkillLevel))

function getBadgeConfig (level: string) {
  const config = {
    BEGINNER: {
      background: 'var(--light-background-primary3)',
      color: 'var(--dark-background-primary3)',
      icon: ICONS_DATA_URL.CLOCK_QUARTER_CHECK
    },
    INTERMEDIATE: {
      background: 'var(--light-background-info)',
      color: 'var(--dark-background-info)',
      icon: ICONS_DATA_URL.CLOCK_THIRD_CHECK
    },
    COMPETENT: {
      background: 'var(--light-background-critical)',
      color: 'var(--light-foreground-critical)',
      icon: ICONS_DATA_URL.CLOCK_HALF_PLUS_CHECK
    },
    ADVANCED: {
      background: 'var(--light-background-primary2)',
      color: 'var(--dark-background-primary2)',
      icon: ICONS_DATA_URL.CLOCK_ALMOST_CHECK
    },
    EXPERT: {
      background: 'var(--light-background-primary1)',
      color: 'var(--light-foreground-primary2)',
      icon: ICONS_DATA_URL.MDI_CHECK_CIRCLE
    }
  }
  return config[level as keyof typeof config] || config.BEGINNER
}

function getBadgeLabel (level: EAdditionalSkillLevel) {
  if (!skillConfig.value) {
    return level
  }
  return isEnumMember(EAdditionalSkillLevel, level) ? skillConfig.value[level]?.label ?? level : level
}

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
    <form.Field name="level">
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
                  <AvBadge
                    :label="getBadgeLabel(level)"
                    :background-color="getBadgeConfig(level).background"
                    :color="getBadgeConfig(level).color"
                    :icon-path="getBadgeConfig(level).icon"
                  />
                </div>
                <span class="b2-regular">
                  {{ getDescription(level) }}
                </span>
              </div>
            </AvRadioButton>
          </template>
        </AvRadioButtonSet>
      </template>
    </form.Field>
  </div>
</template>

<style scoped lang="scss">
@use "@/ui/styles/typography.scss" as typography;

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
