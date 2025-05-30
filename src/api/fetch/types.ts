export interface FetchConfig {
  baseUrl?: string
  defaultHeaders?: HeadersInit
}

export type RequestInterceptor = (url: string, options: RequestInit, config: FetchConfig) => RequestInit | Promise<RequestInit>

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>
