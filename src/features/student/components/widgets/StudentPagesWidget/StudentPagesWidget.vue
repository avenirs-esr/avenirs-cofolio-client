<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { useNavigation } from '@/common/composables'
import { formatDateToLocaleString } from '@/common/utils'
import { useStudentPagesSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, AvIconText, AvRichButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { data: pages } = useStudentPagesSummaryQuery()
const { locale, t } = useI18n()
const { navigateToStudentPages } = useNavigation()

const renderedPages = computed(() => pages.value.slice(0, 3))
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="pages-widget-container__title">
        <AvIconText
          :icon="MDI_ICONS.FILE_DOCUMENT_EDIT"
          :text="t('student.widgets.pages.title')"
          icon-color="var(--foreground-icon)"
          text-color="var(--foreground-text1)"
          typography-class="s1-bold"
          gap="0.75rem"
        />
      </div>
    </template>
    <template #body>
      <div class="pages-widget-container__body">
        <ul class="pages-widget__actions">
          <li
            v-for="page in renderedPages"
            :key="page.id"
          >
            <AvRichButton
              :icon-right="MDI_ICONS.ARROW_RIGHT"
              custom-padding="0.5rem"
              :on-click="() => {}"
            >
              <div class="pages-widget-action__body">
                <div class="pages-widget-action__leftIcon">
                  <VIcon
                    :name="MDI_ICONS.FILE_ACCOUNT"
                    color="var(--white)"
                    scale="1.25"
                  />
                </div>
                <div class="pages-widget-action__description ellipsis-container">
                  <span class="ellipsis b1-regular">{{ page.name }}</span>
                  <span class="ellipsis caption-light">
                    {{ t('student.widgets.pages.updatedAt', { date: formatDateToLocaleString(page.updatedAt, locale as AvLocale) }) }}
                  </span>
                </div>
              </div>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="pages-widget-container__footer">
        <AvButton
          :label="t('student.widgets.pages.buttons.seeAll')"
          :on-click="navigateToStudentPages"
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.pages-widget-container__title {
  padding-left: 0.75rem;
}

.pages-widget-container__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pages-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

.pages-widget-action__leftIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}

.pages-widget-action__description {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.pages-widget-action__body {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.pages-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
