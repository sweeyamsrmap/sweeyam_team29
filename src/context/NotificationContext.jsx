import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider')
    }
    return context
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random()
        setNotifications(prev => [...prev, { id, message, type }])

        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id))
            }, duration)
        }

        return id
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const success = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification])
    const error = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification])
    const info = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification])
    const warning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification])

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, info, warning }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
                {notifications.map((notification) => (
                    <Toast
                        key={notification.id}
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    )
}

function Toast({ notification, onClose }) {
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    }

    const colors = {
        success: 'bg-emerald-500 border-emerald-400',
        error: 'bg-red-500 border-red-400',
        warning: 'bg-orange-500 border-orange-400',
        info: 'bg-blue-500 border-blue-400'
    }

    return (
        <div
            className={`${colors[notification.type]} text-white px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-in backdrop-blur-sm`}
            style={{
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <span className="material-symbols-outlined">{icons[notification.type]}</span>
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button onClick={onClose} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    )
}

export default NotificationProvider
