import { ErrorCodes } from '@/common/constants'
import { BaseApiErrorCode } from '@/common/exceptions'
import ActivityErrorMessage, { type ActivityErrorMessageProps } from '@/features/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity error message component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityErrorMessage>>

  BddTest().when('the component is rendered with a not found error', () => {
    const props: ActivityErrorMessageProps = {
      error: {
        name: 'ActivityNotFoundError',
        message: 'Activity not found',
        status: 404,
        code: ErrorCodes.ACTIVITY_NOT_FOUND
      }
    }

    beforeEach(() => {
      wrapper = mount(ActivityErrorMessage, { props })
    })

    BddTest().then('it should render the not found message', () => {
      const message = wrapper.find('[data-testid="error-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('L\'activité que vous recherchez n\'existe pas ou n\'est pas accessible.')
      expect(message.text()).toContain('Activité introuvable')
    })
  })

  BddTest().when('the component is rendered with an unknown error with message', () => {
    const props: ActivityErrorMessageProps = {
      error: {
        name: 'InternalServerError',
        message: 'Internal Server Error',
        status: 500,
        code: ErrorCodes.UNKNOWN
      }
    }

    beforeEach(() => {
      wrapper = mount(ActivityErrorMessage, { props })
    })

    BddTest().then('it should render the error with generic title and an error message', () => {
      const message = wrapper.find('[data-testid="error-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('Une erreur est survenue. Veuillez réessayer ultérieurement.')
      expect(message.text()).not.toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })

  BddTest().when('the component is rendered with an unknown error without message', () => {
    const props: ActivityErrorMessageProps = {
      error: {
        name: 'InternalServerError',
        message: '',
        status: 500,
        code: BaseApiErrorCode.UNKNOWN
      }
    }

    beforeEach(() => {
      wrapper = mount(ActivityErrorMessage, { props })
    })

    BddTest().then('it should render the error with generic title and no description', () => {
      const message = wrapper.find('[data-testid="error-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('Une erreur est survenue. Veuillez réessayer ultérieurement.')
      expect(message.text()).not.toBe('Une erreur est survenue. Veuillez réessayer ultérieurement.')
    })
  })

  BddTest().when('the component is rendered without error', () => {
    const props: ActivityErrorMessageProps = {
      error: null
    }

    beforeEach(() => {
      wrapper = mount(ActivityErrorMessage, { props })
    })

    BddTest().then('it should not render the error', () => {
      const message = wrapper.find('[data-testid="error-message"]')
      expect(message.exists()).toBe(false)
    })
  })
})
