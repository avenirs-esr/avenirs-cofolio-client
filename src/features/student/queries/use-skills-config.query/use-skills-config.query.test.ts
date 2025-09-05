import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import { mountQueryComposable } from '@/ui/tests/utils'
import { describe, expect, it, vi } from 'vitest'

import { useAdditionalSkillConfig } from './use-skills-config.query'

describe('useAdditionalSkillConfig', () => {
  describe('given the additional skill config query', () => {
    describe('when the query is executed', () => {
      it('then it should return a query result object', () => {
        const result = mountQueryComposable(() => useAdditionalSkillConfig())

        expect(result).toBeDefined()
        expect(result.data).toBeDefined()
        expect(result.isLoading).toBeDefined()
        expect(result.isError).toBeDefined()
        expect(result.error).toBeDefined()
        expect(result.status).toBeDefined()
      })

      it('then it should be in loading state initially', () => {
        const result = mountQueryComposable(() => useAdditionalSkillConfig())

        expect(result.isLoading.value).toBe(true)
        expect(result.data.value).toBeUndefined()
      })

      it('then it should have pending status initially', () => {
        const result = mountQueryComposable(() => useAdditionalSkillConfig())

        expect(result.status.value).toBe('pending')
      })

      it('then it should successfully fetch additional skill configuration data', async () => {
        const result = mountQueryComposable(() => useAdditionalSkillConfig())

        await vi.waitFor(() => {
          expect(result.isSuccess.value).toBe(true)
        })

        expect(result.data.value).toBeDefined()
        expect(result.data.value).toHaveProperty(EAdditionalSkillLevel.BEGINNER)
        expect(result.data.value).toHaveProperty(EAdditionalSkillLevel.INTERMEDIATE)
        expect(result.data.value).toHaveProperty(EAdditionalSkillLevel.COMPETENT)
        expect(result.data.value).toHaveProperty(EAdditionalSkillLevel.ADVANCED)
        expect(result.data.value).toHaveProperty(EAdditionalSkillLevel.EXPERT)
      })

      it('then it should return correct configuration for each skill level', async () => {
        const result = mountQueryComposable(() => useAdditionalSkillConfig())

        await vi.waitFor(() => {
          expect(result.isSuccess.value).toBe(true)
        })

        const config = result.data.value!

        expect(config[EAdditionalSkillLevel.BEGINNER]).toEqual({
          label: 'Débutant',
          description: 'Je découvre cette compétence'
        })

        expect(config[EAdditionalSkillLevel.INTERMEDIATE]).toEqual({
          label: 'Intermédiaire',
          description: 'Je commence à maîtriser cette compétence'
        })

        expect(config[EAdditionalSkillLevel.COMPETENT]).toEqual({
          label: 'Compétent',
          description: 'Je maîtrise cette compétence'
        })

        expect(config[EAdditionalSkillLevel.ADVANCED]).toEqual({
          label: 'Avancé',
          description: 'Je maîtrise bien cette compétence'
        })

        expect(config[EAdditionalSkillLevel.EXPERT]).toEqual({
          label: 'Expert',
          description: 'Je maîtrise parfaitement cette compétence'
        })
      })
    })
  })
})
