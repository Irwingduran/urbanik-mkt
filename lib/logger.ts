// Lightweight structured logger without external dependencies
// Usage: import { logger } from "@/lib/logger"; logger.info("message", { ctx })

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogMeta {
  [key: string]: unknown
}

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const envLevel = (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug")
const threshold = LEVELS[envLevel]

function fmt(level: LogLevel, message: string, meta?: LogMeta) {
  const base = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...meta,
  }

  // Pretty print in dev
  if (process.env.NODE_ENV !== "production") {
    const { level: l, msg, ts, ...rest } = base
    const ctx = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : ""
    return `[${ts}] ${l.toUpperCase()} ${msg}${ctx}`
  }

  // JSON line in prod
  return JSON.stringify(base)
}

function emit(level: LogLevel, message: string, meta?: LogMeta) {
  if (LEVELS[level] < threshold) return
  const line = fmt(level, message, meta)
  switch (level) {
    case "debug":
      console.debug(line)
      break
    case "info":
      console.log(line)
      break
    case "warn":
      console.warn(line)
      break
    case "error":
      console.error(line)
      break
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => emit("debug", message, meta),
  info: (message: string, meta?: LogMeta) => emit("info", message, meta),
  warn: (message: string, meta?: LogMeta) => emit("warn", message, meta),
  error: (message: string, meta?: LogMeta) => emit("error", message, meta),
}

export type { LogLevel, LogMeta }
