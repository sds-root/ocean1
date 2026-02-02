// MOCK DB due to Bun/Windows crash
export const db = {
  select: () => ({
    from: (_table: any) => ({
      all: () => [
        { id: 1, content: "Mock Todo 1", completed: false },
        { id: 2, content: "Mock Todo 2 (DB is mocked)", completed: true }
      ]
    })
  })
}
