<script setup lang="ts">
import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import AddAdditionalSkillLevelField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillLevelField/AddAdditionalSkillLevelField.vue'

interface AdditionalSkillLevelFormFieldProps {
  form: UpdateAdditionalSkillForm
}

const { form } = defineProps<AdditionalSkillLevelFormFieldProps>()
const FormField = form.Field
</script>

<template>
  <FormField name="level">
    <template #default="{ field }">
      <AddAdditionalSkillLevelField
        v-bind="$attrs"
        :form="form"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
