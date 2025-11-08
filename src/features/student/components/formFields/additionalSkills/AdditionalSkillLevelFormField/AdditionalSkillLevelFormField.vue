<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type { AdditionalSkillForm } from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import AddAdditionalSkillLevelField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillLevelField/AddAdditionalSkillLevelField.vue'
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
      <AddAdditionalSkillLevelField
        v-bind="$attrs"
        v-model="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        @update:model-value="field.handleChange"
        @blur="field.handleBlur"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
