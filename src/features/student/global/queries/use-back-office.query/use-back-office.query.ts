import type { BaseApiException } from '@/common/exceptions'
import { type BuildLifeProjectConfigDTO, getBuildLifeProjectConfig } from '@/api/avenir-esr'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['back-office', 'config']

export function useBackOfficeBuildLifeProjectConfigQuery (): UseQueryReturnType<BuildLifeProjectConfigDTO, BaseApiException> {
  const queryKey = [...commonQueryKeys, 'website-content', 'build-life-project']

  return useQuery<BuildLifeProjectConfigDTO, BaseApiException>({
    queryKey,
    queryFn: getBuildLifeProjectConfig,
  })
}
