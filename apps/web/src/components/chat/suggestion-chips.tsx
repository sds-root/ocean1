import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ResolvedSuggestion } from '@/hooks/use-suggestions'
import {
  Activity, FileText, RefreshCw, BarChart2,
  Database, ListChecks, HelpCircle, Sparkles,
  GitCompareArrows, Zap, Clock
} from 'lucide-react'

interface SuggestionChipsProps {
  suggestions: ResolvedSuggestion[]
  onSelect: (suggestion: ResolvedSuggestion) => void
  className?: string
}

export function SuggestionChips({ suggestions, onSelect, className }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2 py-2 px-1", className)}>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        제안:
      </span>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          className="h-7 text-xs rounded-full px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
          onClick={() => onSelect(suggestion)}
        >
          <SuggestionIcon label={suggestion.label} />
          <span className="ml-1.5">{suggestion.label}</span>
        </Button>
      ))}
    </div>
  )
}

function SuggestionIcon({ label }: { label: string }) {
  if (label.includes('비교')) return <GitCompareArrows className="h-3 w-3" />
  if (label.includes('영향') || label.includes('연관')) return <Zap className="h-3 w-3" />
  if (label.includes('타임라인')) return <Clock className="h-3 w-3" />
  if (label.includes('상태') || label.includes('헬스')) return <Activity className="h-3 w-3" />
  if (label.includes('로그')) return <FileText className="h-3 w-3" />
  if (label.includes('재시작')) return <RefreshCw className="h-3 w-3" />
  if (label.includes('메트릭') || label.includes('스케일') || label.includes('성능')) return <BarChart2 className="h-3 w-3" />
  if (label.includes('백업') || label.includes('연결') || label.includes('복제')) return <Database className="h-3 w-3" />
  if (label.includes('요약') || label.includes('진행') || label.includes('정리') || label.includes('조치')) return <ListChecks className="h-3 w-3" />
  return <HelpCircle className="h-3 w-3" />
}

SuggestionChips.displayName = 'SuggestionChips'
