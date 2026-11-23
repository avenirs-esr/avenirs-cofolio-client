import type { VueWrapper } from '@vue/test-utils'
import type { EditPublishedActivityConfirmationModalProps } from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { mockedActivityContentWithSubActivities, mockedActivityContentWithSubActivitiesAndEnrolledStudents, mockedSubActivityContent, mockedSubActivityContentWithEnrolledStudents } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import EditPublishedActivityConfirmationModal from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.vue'

const TITLE = 'Souhaitez-vous modifier la sous-activité "{title}"\u00A0?'
const WITH_ENROLLED_STUDENTS_DESCRIPTION = 'Un brouillon de l\'activité parente "{parentTitle}" sera créé. La version actuelle restera publiée et accessible aux apprenants déjà inscrits jusqu\'à la publication de vos modifications.'
const WITHOUT_ENROLLED_STUDENTS_DESCRIPTION = 'L\'activité parente "{parentTitle}" sera dépubliée et repassera en brouillon jusqu\'à la publication de vos modifications.'

const defaultProps: EditPublishedActivityConfirmationModalProps = {
  opened: true,
  activity: mockedSubActivityContent,
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

  const title = (title: string) => {
    return TITLE.replace('{title}', title)
  }

  const descriptionWithEnrolledStudents = (parentTitle: string) => {
    return WITH_ENROLLED_STUDENTS_DESCRIPTION.replace('{parentTitle}', parentTitle)
  }

  const descriptionWithoutEnrolledStudents = (parentTitle: string) => {
    return WITHOUT_ENROLLED_STUDENTS_DESCRIPTION.replace('{parentTitle}', parentTitle)
  }

  BddTest().when('it is opened on a sub-activity whose parent activity has no enrolled student', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should open the confirmation modal', () => {
      expect(getConfirmationModal().props('opened')).toBe(true)
    })

    BddTest().then('it should ask whether to edit the sub-activity', () => {
      const expectedTitle = title(mockedSubActivityContent.title)

      expect(getConfirmationModal().props('title')).toBe(expectedTitle)
    })

    BddTest().then('it should explain that the parent activity will be unpublished', async () => {
      const expectedDescription = descriptionWithoutEnrolledStudents(mockedActivityContentWithSubActivities.title)

      await vi.waitFor(() => {
        expect(getConfirmationModal().props('description')).toBe(expectedDescription)
      })
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

  BddTest().when('it is opened on a sub-activity whose parent activity has enrolled students', () => {
    beforeEach(() => {
      mountWith({
        activity: mockedSubActivityContentWithEnrolledStudents,
      })
    })

    BddTest().then('it should explain that a draft of the parent activity will be created', async () => {
      const expectedDescription = descriptionWithEnrolledStudents(mockedActivityContentWithSubActivitiesAndEnrolledStudents.title)

      await vi.waitFor(() => {
        expect(getConfirmationModal().props('description')).toBe(expectedDescription)
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
})
