import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastListeners: ((toasts: Toast[]) => void)[] = []

export function toast(message: string, type: ToastType = 'info') {
  const newToast: Toast = {
    id: Date.now().toString(),
    message,
    type,
  }
  
  // Update global toasts state
  currentToasts = [...currentToasts, newToast]
  toastListeners.forEach(listener => listener(currentToasts))
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    removeToast(newToast.id)
  }, 4000)
}

export function removeToast(id: string) {
  currentToasts = currentToasts.filter(t => t.id !== id)
  toastListeners.forEach(listener => listener(currentToasts))
}

let currentToasts: Toast[] = []

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>(currentToasts)
  
  useEffect(() => {
    toastListeners.push(setToasts)
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts)
    }
  }, [])
  
  if (toasts.length === 0) return null
  
  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { bg: '#1B3D1B', border: '#4CAF50', icon: '✓' }
      case 'error':
        return { bg: '#5C2020', border: '#F44336', icon: '✕' }
      case 'warning':
        return { bg: '#5C4514', border: '#FF9800', icon: '!' }
      case 'info':
        return { bg: '#1B3D5C', border: '#00F1FF', icon: 'i' }
    }
  }
  
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => {
        const styles = getTypeStyles(t.type)
        return (
          <div
            key={t.id}
            className="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in"
            style={{ 
              backgroundColor: styles.bg, 
              border: `1px solid ${styles.border}`,
              color: 'white',
            }}
            onClick={() => removeToast(t.id)}
          >
            <span 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: styles.border }}
            >
              {styles.icon}
            </span>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}