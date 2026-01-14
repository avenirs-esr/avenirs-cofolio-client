import { EDeclaredSkillLevel } from '@/api/avenir-esr'
import { useAdditionalSkillConfig } from '@/features/student/declaredSkills/queries/use-skills-config.query/use-skills-config.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { expect, vi } from 'vitest'

BddTest().given('the additional skill config composable', () => {
  BddTest().when('the query is executed', () => {
    BddTest().then('it should return a query result object', () => {
      const result = mountQueryComposable(() => useAdditionalSkillConfig())

      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.isError).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.status).toBeDefined()
    })

    BddTest().then('it should be in loading state initially', () => {
      const result = mountQueryComposable(() => useAdditionalSkillConfig())

      expect(result.isLoading.value).toBe(true)
      expect(result.data.value).toBeUndefined()
    })

    BddTest().then('it should have pending status initially', () => {
      const result = mountQueryComposable(() => useAdditionalSkillConfig())

      expect(result.status.value).toBe('pending')
    })

    BddTest().then('it should successfully fetch additional skill configuration data', async () => {
      const result = mountQueryComposable(() => useAdditionalSkillConfig())

      await vi.waitFor(() => {
        expect(result.isSuccess.value).toBe(true)
      })

      expect(result.data.value).toBeDefined()
      expect(result.data.value).toHaveProperty(EDeclaredSkillLevel.BEGINNER)
      expect(result.data.value).toHaveProperty(EDeclaredSkillLevel.INTERMEDIATE)
      expect(result.data.value).toHaveProperty(EDeclaredSkillLevel.COMPETENT)
      expect(result.data.value).toHaveProperty(EDeclaredSkillLevel.ADVANCED)
      expect(result.data.value).toHaveProperty(EDeclaredSkillLevel.EXPERT)
    })

    BddTest().then('it should return correct configuration for each skill level', async () => {
      const result = mountQueryComposable(() => useAdditionalSkillConfig())

      await vi.waitFor(() => {
        expect(result.isSuccess.value).toBe(true)
      })

      const config = result.data.value!

      expect(config[EDeclaredSkillLevel.BEGINNER]).toEqual({
        label: 'Débutant',
        description: 'Je découvre cette compétence'
      })

      expect(config[EDeclaredSkillLevel.INTERMEDIATE]).toEqual({
        label: 'Intermédiaire',
        description: 'Je commence à maîtriser cette compétence'
      })

      expect(config[EDeclaredSkillLevel.COMPETENT]).toEqual({
        label: 'Compétent',
        description: 'Je maîtrise cette compétence'
      })

      expect(config[EDeclaredSkillLevel.ADVANCED]).toEqual({
        label: 'Avancé',
        description: 'Je maîtrise bien cette compétence'
      })

      expect(config[EDeclaredSkillLevel.EXPERT]).toEqual({
        label: 'Expert',
        description: 'Je maîtrise parfaitement cette compétence'
      })
    })
  })
})
