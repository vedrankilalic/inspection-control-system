import toast from 'react-hot-toast'

const errorDurationMs = 5200

export function notifyError(message: string) {
  toast.error(message, { duration: errorDurationMs })
}

export function notifyErrorFromUnknown(e: unknown, fallback: string) {
  notifyError(e instanceof Error ? e.message : fallback)
}

export function notifyErrorFromUnknownAfterModalClose(e: unknown, fallback: string) {
  window.setTimeout(() => notifyErrorFromUnknown(e, fallback), 0)
}
