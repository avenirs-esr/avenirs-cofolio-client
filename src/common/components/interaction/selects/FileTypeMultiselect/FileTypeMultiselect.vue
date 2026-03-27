<script lang="ts" setup>
import { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import { AvMultiselect, type AvMultiselectOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{ maxHeight?: string }>()

const { t } = useI18n()

const typesSelected = defineModel<AvMultiselectOption[]>({ default: [] })

const typesOptions: AvMultiselectOption[] = [
  {
    value: FileGlobalType.PDF,
    label: t('global.selects.FileTypeMultiselect.PDF'),
    icon: MDI_ICONS.FILE
  },
  {
    value: FileGlobalType.TEXT,
    label: t('global.selects.FileTypeMultiselect.TEXT'),
    icon: MDI_ICONS.FILE
  },
  {
    value: FileGlobalType.SHEET,
    label: t('global.selects.FileTypeMultiselect.SHEET'),
    icon: MDI_ICONS.FILE
  },
  {
    value: FileGlobalType.IMAGE,
    label: t('global.selects.FileTypeMultiselect.IMAGE'),
    icon: MDI_ICONS.FILE_IMAGE_OUTLINE
  },
  {
    value: FileGlobalType.VIDEO,
    label: t('global.selects.FileTypeMultiselect.VIDEO'),
    icon: MDI_ICONS.CLAPPERBOARD_OUTLINE
  },
  {
    value: FileGlobalType.AUDIO,
    label: t('global.selects.FileTypeMultiselect.AUDIO'),
    icon: MDI_ICONS.LOUDSPEAKER_OUTLINE
  }
]
</script>

<template>
  <AvMultiselect
    v-model="typesSelected"
    class="file-type-multiselect"
    :options="typesOptions"
    :label="t('global.selects.FileTypeMultiselect.label')"
    :placeholder="t('global.selects.FileTypeMultiselect.placeholder')"
    :selected-text="t('global.selects.FileTypeMultiselect.selected', { count: typesSelected.length })"
    dense
    width="14.875rem"
    height="2.5rem"
    :collapse-max-height="maxHeight"
    data-testid="file-type-multiselect"
  />
</template>
