import type { VueWrapper } from '@vue/test-utils'
import type { EditPublishedActivityConfirmationModalProps } from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { interpolateTranslation, mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { mockedActivityContent, mockedActivityContentWithEnrolledStudent1, mockedActivityContentWithOneSubActivity, mockedActivityContentWithSubActivities, mockedActivityContentWithSubActivitiesAndEnrolledStudents, mockedSubActivityContent, mockedSubActivityContentWithEnrolledStudents } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import EditPublishedActivityConfirmationModal from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.vue'

const ACTIVITY_TITLE = 'Souhaitez-vous modifier l\'activité "{title}"\u00A0?'
const ACTIVITY_WITH_ENROLLED_STUDENTS = 'Un brouillon sera créé. La version actuelle restera publiée et accessible aux apprenants déjà inscrits jusqu\'à la publication de vos modifications.'
const ACTIVITY_WITHOUT_ENROLLED_STUDENTS = 'Elle sera dépubliée et repassera en brouillon jusqu\'à la publication de vos modifications.'
const SUB_ACTIVITIES_COMPLEMENT = 'Vous pourrez également modifier ses sous-activités.'
const SUB_ACTIVITY_COMPLEMENT = 'Vous pourrez également modifier sa sous-activité.'
const SUB_ACTIVITY_TITLE = 'Souhaitez-vous modifier la sous-activité "{title}"\u00A0?'
const SUB_ACTIVITY_WITH_ENROLLED_STUDENTS = 'Un brouillon de l\'activité parente "{parentTitle}" sera créé. La version actuelle restera publiée et accessible aux apprenants déjà inscrits jusqu\'à la publication de vos modifications.'
const SUB_ACTIVITY_WITHOUT_ENROLLED_STUDENTS = 'L\'activité parente "{parentTitle}" sera dépubliée et repassera en brouillon jusqu\'à la publication de vos modifications.'

const defaultProps: EditPublishedActivityConfirmationModalProps = {
  opened: true,
  activity: mockedActivityContent,
}

BddTest().given('an EditPublishedActivityConfirmationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof EditPublishedActivityConfirmationModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountWith = (props: Partial<EditPublishedActivityConfirmationModalProps> = {}) => {
    wrapper = mountComponent(EditPublishedActivityConfirmationModal, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs },
    })
  }

  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  const expectTitle = (title: string) => {
    expect(getConfirmationModal().props('title')).toBe(title)
  }

  const expectDescription = async (...sentences: string[]) => {
    await vi.waitFor(() => {
      expect(getConfirmationModal().props('description')).toBe(sentences.join(' '))
    })
  }

  BddTest().when('it is opened', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should open the confirmation modal', () => {
      expect(getConfirmationModal().props('opened')).toBe(true)
    })

    BddTest().and('the modal emits close', () => {
      beforeEach(() => {
        getConfirmationModal().vm.$emit('close')
      })

      BddTest().then('it should re-emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('the modal emits confirm', () => {
      beforeEach(() => {
        getConfirmationModal().vm.$emit('confirm')
      })

      BddTest().then('it should re-emit confirm', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })

  BddTest().when('it is closed', () => {
    beforeEach(() => {
      mountWith({
        opened: false,
      })
    })

    BddTest().then('it should keep the confirmation modal closed', () => {
      expect(getConfirmationModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('it is opened on a sub-activity', () => {
    BddTest().and('its parent activity has no enrolled student', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedSubActivityContent,
        })
      })

      BddTest().then('it should ask whether to edit the sub-activity', () => {
        expectTitle(interpolateTranslation(SUB_ACTIVITY_TITLE, {
          title: mockedSubActivityContent.title,
        }))
      })

      BddTest().then('it should explain that the parent activity will be unpublished', async () => {
        await expectDescription(interpolateTranslation(SUB_ACTIVITY_WITHOUT_ENROLLED_STUDENTS, {
          parentTitle: mockedActivityContentWithSubActivities.title,
        }))
      })
    })

    BddTest().and('its parent activity has enrolled students', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedSubActivityContentWithEnrolledStudents,
        })
      })

      BddTest().then('it should explain that a draft of the parent activity will be created', async () => {
        await expectDescription(interpolateTranslation(SUB_ACTIVITY_WITH_ENROLLED_STUDENTS, {
          parentTitle: mockedActivityContentWithSubActivitiesAndEnrolledStudents.title,
        }))
      })
    })
  })

  BddTest().when('it is opened on an activity', () => {
    BddTest().and('it has neither enrolled student nor sub-activity', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedActivityContent,
        })
      })

      BddTest().then('it should ask whether to edit the activity', () => {
        expectTitle(interpolateTranslation(ACTIVITY_TITLE, {
          title: mockedActivityContent.title,
        }))
      })

      BddTest().then('it should explain that the activity will be unpublished', async () => {
        await expectDescription(ACTIVITY_WITHOUT_ENROLLED_STUDENTS)
      })
    })

    BddTest().and('it has enrolled students', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedActivityContentWithEnrolledStudent1,
        })
      })

      BddTest().then('it should explain that a draft will be created', async () => {
        await expectDescription(ACTIVITY_WITH_ENROLLED_STUDENTS)
      })
    })

    BddTest().and('it has one sub-activity', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedActivityContentWithOneSubActivity,
        })
      })

      BddTest().then('it should mention that its sub-activity can be edited too', async () => {
        await expectDescription(ACTIVITY_WITHOUT_ENROLLED_STUDENTS, SUB_ACTIVITY_COMPLEMENT)
      })
    })

    BddTest().and('it has several sub-activities', () => {
      beforeEach(() => {
        mountWith({
          activity: mockedActivityContentWithSubActivities,
        })
      })

      BddTest().then('it should mention that its sub-activities can be edited too', async () => {
        await expectDescription(ACTIVITY_WITHOUT_ENROLLED_STUDENTS, SUB_ACTIVITIES_COMPLEMENT)
      })
    })
  })
})
