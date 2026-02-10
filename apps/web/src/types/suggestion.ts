export interface Suggestion {
  id: string
  label: string
  /** {names} = 쉼표 구분 전체 이름, {name} = 첫 번째 이름 */
  prompt: string
}

export type ResourceSuggestionKey = 'ec2' | 'rds' | 'k8s' | 's3'
export type TicketSuggestionKey = 'open' | 'in_progress' | 'resolved'

export interface SuggestionConfig {
  /** 단일 리소스 선택 시 */
  resources: Record<ResourceSuggestionKey, Suggestion[]>
  /** 단일 티켓 선택 시 */
  tickets: Record<TicketSuggestionKey, Suggestion[]>
  /** 같은 타입 리소스 복수 선택 시 */
  multiResources: Record<ResourceSuggestionKey, Suggestion[]>
  /** 서로 다른 타입 리소스 복수 선택 시 */
  mixedResources: Suggestion[]
  /** 티켓 복수 선택 시 */
  multiTickets: Suggestion[]
  /** 리소스 + 티켓 콤보 선택 시 */
  combo: Suggestion[]
  defaultResource: Suggestion[]
  defaultTicket: Suggestion[]
}
