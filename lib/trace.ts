import { logger, LogMeta } from "@/lib/logger"

// Simple tracing helper to log spans with durations
// Usage:
// const tracer = createTracer("component.name", { requestId })
// await tracer.span("operation", async () => { ... })

export function createTracer(component: string, baseMeta?: LogMeta) {
  const metaBase = { component, ...baseMeta }

  function start(name: string, meta?: LogMeta) {
    const startTime = Date.now()
    const m = { ...metaBase, span: name, ...meta }
    logger.debug(`▶ start ${name}`, m)
    return function end(extra?: LogMeta) {
      const durationMs = Date.now() - startTime
      logger.debug(`■ end ${name}`, { ...m, durationMs, ...extra })
    }
  }

  async function span<T>(name: string, fn: () => Promise<T> | T, meta?: LogMeta): Promise<T> {
    const end = start(name, meta)
    try {
      const res = await fn()
      end()
      return res
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      end({ error: message })
      throw err
    }
  }

  return { start, span }
}

export type Tracer = ReturnType<typeof createTracer>
