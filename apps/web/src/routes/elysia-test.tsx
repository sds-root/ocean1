import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export const Route = createFileRoute('/elysia-test')({
  component: ElysiaTest,
})

function ElysiaTest() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await api.api.todos.get()
        if (error) {
          setError(error.value as string)
        } else {
          setData(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Elysia Eden Treaty Test</h1>
      
      {error && (
        <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded border border-destructive/20">
          <p className="font-semibold">Error fetching data:</p>
          <p className="text-sm opacity-90">{error}</p>
          <p className="text-xs mt-2 text-muted-foreground">(Note: Backend might be down, this is expected if server isn't running)</p>
        </div>
      )}

      {!data && !error && (
        <p className="text-muted-foreground animate-pulse">Loading todos...</p>
      )}

      {data && (
        <div className="space-y-4">
          <p className="text-green-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Successfully fetched data (Types verified!):
          </p>
          <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-[400px] border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
