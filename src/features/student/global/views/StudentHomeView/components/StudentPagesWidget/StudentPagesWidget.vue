<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { mockedPagesOverview } from '@/__mocks__/fixtures/student'
import { useNavigation } from '@/common/composables'
import { formatDateToLocaleString } from '@/common/utils'
import HomeWidget from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.vue'
import { AvIcon, AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { navigateToStudentPages } = useNavigation()
const { locale, t } = useI18n()

const pages = computed(() => mockedPagesOverview.slice(0, 3))

const isDemo = __DEMO_MODE__
</script>

<template>
  <HomeWidget
    :title="t('student.global.widgets.pages.title')"
    :title-icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
    :see-all-label="t('student.global.widgets.pages.buttons.seeAll')"
    :display-widget="pages.length > 0 && !isDemo"
    type="side"
    data-testid="student-pages-widget"
    @see-all-click="navigateToStudentPages"
  >
    <ul class="av-col av-gap-sm av-list-reset">
      <li
        v-for="page in pages"
        :key="page.id"
        data-testid="page-item"
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
              <span
                class="ellipsis caption-light"
                data-testid="page-item-updated-at"
              >
                {{ t('student.global.widgets.pages.updatedAt', { date: formatDateToLocaleString(page.updatedAt, locale as AvLocale) }) }}
              </span>
            </div>
          </div>
        </AvRichButton>
      </li>
    </ul>
  </HomeWidget>
</template>

<style lang="scss" scoped>
.pages-widget-action__leftIcon {
  width: var(--dimension-xl);
  height: var(--dimension-xl);
  background-color: var(--dark-background-primary1);
  flex-shrink: 0;
}
</style>
