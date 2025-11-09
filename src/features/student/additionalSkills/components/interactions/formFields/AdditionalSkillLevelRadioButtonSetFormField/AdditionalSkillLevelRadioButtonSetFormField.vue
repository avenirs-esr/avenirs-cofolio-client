<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type { AdditionalSkillForm } from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import AdditionalSkillLevelRadioButtonSet from '@/features/student/additionalSkills/components/interactions/radios/AdditionalSkillLevelRadioButtonSet/AdditionalSkillLevelRadioButtonSet.vue'
import { markRaw } from 'vue'

interface AdditionalSkillLevelFormFieldProps {
  form: UpdateAdditionalSkillForm | AdditionalSkillForm
}

const { form } = defineProps<AdditionalSkillLevelFormFieldProps>()
const FormField = markRaw(form.Field)
</script>

<template>
  <FormField name="level">
    <template #default="{ field }">
      <AdditionalSkillLevelRadioButtonSet
        v-bind="$attrs"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="(value) => {
          if (typeof value === 'string' && isEnumMember(EAdditionalSkillLevel, value)) {
            field.handleChange(value)
          }
        }"
        @blur="field.handleBlur"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
