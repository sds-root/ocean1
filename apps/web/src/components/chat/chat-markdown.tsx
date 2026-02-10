import { memo, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { useState, useCallback } from 'react'

interface ChatMarkdownProps {
  content: string
  className?: string
  variant?: 'assistant' | 'user'
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function CodeBlock({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
  const isInline = !className
  const text = String(children).replace(/\n$/, '')

  if (isInline) {
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-[0.8em] font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  }

  const lang = className?.replace('hljs language-', '').replace('language-', '') ?? ''

  return (
    <div className="group relative">
      {lang && (
        <div className="absolute left-3 top-0 -translate-y-1/2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary uppercase tracking-wider">
            {lang}
          </span>
        </div>
      )}
      <CopyButton text={text} />
      <code className={cn(className, "block")} {...props}>
        {children}
      </code>
    </div>
  )
}

function ChatMarkdownRaw({ content, className, variant = 'assistant' }: ChatMarkdownProps) {
  return (
    <div className={cn(
      "chat-markdown prose prose-sm max-w-none",
      variant === 'user' ? "prose-invert-user" : "dark:prose-invert",
      className,
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          pre({ children, ...props }) {
            return (
              <pre
                className="rounded-lg border bg-muted/30 p-4 pt-5 overflow-x-auto text-[0.8em] leading-relaxed"
                {...props}
              >
                {children}
              </pre>
            )
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-left border-collapse" {...props}>
                  {children}
                </table>
              </div>
            )
          },
          th({ children, ...props }) {
            return (
              <th className="border-b-2 border-border px-3 py-2 font-semibold text-foreground" {...props}>
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td className="border-b border-border px-3 py-2" {...props}>
                {children}
              </td>
            )
          },
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                {...props}
              >
                {children}
              </a>
            )
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
                {...props}
              >
                {children}
              </blockquote>
            )
          },
          ul({ children, ...props }) {
            return (
              <ul className="list-disc pl-6 space-y-1" {...props}>
                {children}
              </ul>
            )
          },
          ol({ children, ...props }) {
            return (
              <ol className="list-decimal pl-6 space-y-1" {...props}>
                {children}
              </ol>
            )
          },
          hr() {
            return <hr className="my-4 border-border" />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export const ChatMarkdown = memo(ChatMarkdownRaw)
ChatMarkdown.displayName = 'ChatMarkdown'
