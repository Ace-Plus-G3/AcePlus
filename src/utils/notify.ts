// utils/notify.ts
import { ElNotification } from 'element-plus'

export type NotifyType = 'success' | 'error'

interface NotifyOptions {
  title?: string
  message: string
  type?: NotifyType
  duration?: number
}

export function showNotify(options: NotifyOptions) {
  const { title = '', message, type = 'success', duration = 3000 } = options

  const iconSVG = {
    success: `
      <svg class="check-icon" viewBox="0 0 52 52">
        <circle class="check-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="check-check" fill="none" d="M14 27l7 7 17-17"/>
      </svg>
    `,
    error: `
      <svg class="x-icon" viewBox="0 0 52 52">
        <circle class="x-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="x-lines" fill="none" d="M16 16 36 36 M36 16 16 36"/>
      </svg>
    `,
  }

  ElNotification({
    title,
    duration,
    position: 'top-right',
    dangerouslyUseHTMLString: true,
    customClass: 'custom-notification',
    message: `
      <div class="notification-content">
        ${iconSVG[type]}
        <div class="message-text">${message}</div>
      </div>
    `,
  })
}
