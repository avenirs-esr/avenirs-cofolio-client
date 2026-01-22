<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useBaseApiExceptionToast, useNavigation } from '@/common/composables'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentPagesSummaryQuery } from '@/features/student/global/queries/use-student-pages.query/use-student-pages.query'
import { AvButton, AvCard, AvIcon, AvIconText, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: pages, error } = useStudentPagesSummaryQuery()
useBaseApiExceptionToast(error)
const { navigateToStudentPages } = useNavigation()
const { locale, t } = useI18n()

const renderedPages = computed(() => pages.value.slice(0, 3))

// TODO DRY: create HomeSideWidget and HomeMainWidget #998
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
  >
    <template #title>
      <div class="av-pl-xs">
        <AvIconText
          :icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
          :text="t('student.global.widgets.pages.title')"
          icon-color="var(--icon)"
          text-color="var(--text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <ul class="av-col av-gap-sm av-list-reset">
        <li
          v-for="page in renderedPages"
          :key="page.id"
        >
          <AvRichButton
            :icon-right="MDI_ICONS.ARROW_RIGHT_THIN"
            :label="page.name"
            custom-padding="var(--spacing-xs)"
          >
            <div class="av-row av-gap-xs">
              <div class="pages-widget-action__leftIcon av-row av-align-center av-justify-center av-radius-md">
                <AvIcon
                  :name="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
                  color="var(--other-background-base)"
                  :size="1.5"
                />
              </div>
              <div class="av-col av-align-start ellipsis-container">
                <span class="ellipsis b1-regular">{{ page.name }}</span>
                <span class="ellipsis caption-light">
                  {{ t('student.global.widgets.pages.updatedAt', { date: formatDateToLocaleString(page.updatedAt, locale as AvLocale) }) }}
                </span>
              </div>
            </div>
          </AvRichButton>
        </li>
      </ul>
    </template>
    <template #footer>
      <div class="av-row av-justify-end av-pt-sm">
        <AvButton
          :label="t('student.global.widgets.pages.buttons.seeAll')"
          :icon="MDI_ICONS.ARROW_RIGHT_THIN"
          small
          @click="navigateToStudentPages"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.pages-widget-action__leftIcon {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}
</style>
