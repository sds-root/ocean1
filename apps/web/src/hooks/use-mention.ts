import { useState, useCallback } from 'react'
import type { MentionItem } from '@/types/mention'

export function useMention() {
  const [mentions, setMentions] = useState<MentionItem[]>([])

  const addMention = useCallback((item: MentionItem) => {
    setMentions(prev => {
      // Prevent duplicates by ID
      if (prev.some(m => m.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const removeMention = useCallback((id: string) => {
    setMentions(prev => prev.filter(m => m.id !== id))
  }, [])

  const clearMentions = useCallback(() => {
    setMentions([])
  }, [])

  return {
    mentions,
    addMention,
    removeMention,
    clearMentions
  }
}
