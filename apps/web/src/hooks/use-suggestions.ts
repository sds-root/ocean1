import { useMemo } from 'react'
import type { MentionItem, MentionResource, MentionTicket } from '@/types/mention'
import type { Suggestion, ResourceSuggestionKey } from '@/types/suggestion'
import { suggestionConfig } from '@/lib/suggestion-config'

export interface ResolvedSuggestion extends Suggestion {
  resolvedPrompt: string
}

const MAX_SUGGESTIONS = 6

function resolvePrompt(prompt: string, names: string[]): string {
  const joined = names.join(', ')
  return prompt
    .replace(/\{names\}/g, joined)
    .replace(/\{name\}/g, names[0] ?? '')
}

function resolve(suggestions: Suggestion[], names: string[]): ResolvedSuggestion[] {
  return suggestions.map((s) => ({
    ...s,
    resolvedPrompt: resolvePrompt(s.prompt, names),
  }))
}

export function useSuggestions(mentions: MentionItem[]): ResolvedSuggestion[] {
  return useMemo(() => {
    if (mentions.length === 0) return []

    const resources = mentions.filter((m): m is MentionResource => m.type === 'resource')
    const tickets = mentions.filter((m): m is MentionTicket => m.type === 'ticket')
    const hasResources = resources.length > 0
    const hasTickets = tickets.length > 0
    const allNames = mentions.map((m) => m.name)

    // ── 콤보: 리소스 + 티켓 동시 선택 ──
    if (hasResources && hasTickets) {
      return resolve(suggestionConfig.combo, allNames).slice(0, MAX_SUGGESTIONS)
    }

    // ── 리소스만 선택 ──
    if (hasResources) {
      const resourceNames = resources.map((r) => r.name)

      if (resources.length === 1) {
        // 단일 리소스
        const rt = resources[0].original.resourceType as ResourceSuggestionKey | undefined
        const list = rt && suggestionConfig.resources[rt]
          ? suggestionConfig.resources[rt]
          : suggestionConfig.defaultResource
        return resolve(list, resourceNames).slice(0, MAX_SUGGESTIONS)
      }

      // 복수 리소스 — 같은 타입인지 확인
      const types = new Set(resources.map((r) => r.original.resourceType))

      if (types.size === 1) {
        // 같은 타입 복수 선택
        const rt = resources[0].original.resourceType as ResourceSuggestionKey | undefined
        const list = rt && suggestionConfig.multiResources[rt]
          ? suggestionConfig.multiResources[rt]
          : suggestionConfig.mixedResources
        return resolve(list, resourceNames).slice(0, MAX_SUGGESTIONS)
      }

      // 서로 다른 타입 복수 선택
      return resolve(suggestionConfig.mixedResources, resourceNames).slice(0, MAX_SUGGESTIONS)
    }

    // ── 티켓만 선택 ──
    if (hasTickets) {
      const ticketNames = tickets.map((t) => t.name)

      if (tickets.length === 1) {
        // 단일 티켓
        const status = tickets[0].original.status
        const list = suggestionConfig.tickets[status] ?? suggestionConfig.defaultTicket
        return resolve(list, ticketNames).slice(0, MAX_SUGGESTIONS)
      }

      // 복수 티켓
      return resolve(suggestionConfig.multiTickets, ticketNames).slice(0, MAX_SUGGESTIONS)
    }

    return []
  }, [mentions])
}
