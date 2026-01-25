import { useRef, useEffect } from 'react'

const InteractiveBackground = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId

        // Config
        const particleCount = 150
        const colors = [
            '#10b981', // Emerald
            '#3b82f6', // Blue
            '#6366f1', // Indigo
            '#2dd4bf', // Teal
            '#f59e0b'  // Amber (selective)
        ]

        const mouse = {
            x: -1000,
            y: -1000,
            radius: 150
        }

        const setCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', setCanvasSize)
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        })

        setCanvasSize()

        class Particle {
            constructor() {
                this.init()
            }

            init() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 2 + 1

                // Base movement
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5

                // For physics
                this.accX = 0
                this.accY = 0
                this.friction = 0.96

                // Color
                this.color = colors[Math.floor(Math.random() * colors.length)]
                this.opacity = Math.random() * 0.5 + 0.3
            }

            draw() {
                ctx.save()
                ctx.globalAlpha = this.opacity
                ctx.fillStyle = this.color

                // Draw as a "dash" or "dot"
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()

                // Add subtle glow
                ctx.shadowBlur = 10
                ctx.shadowColor = this.color
                ctx.restore()
            }

            update() {
                // Mouse reaction
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius
                    const angle = Math.atan2(dy, dx)

                    // Repel from mouse
                    this.accX -= Math.cos(angle) * force * 0.5
                    this.accY -= Math.sin(angle) * force * 0.5

                    // Speed up slightly when near mouse
                    this.vx *= 1.02
                    this.vy *= 1.02
                }

                // Apply forces
                this.vx += this.accX
                this.vy += this.accY
                this.vx *= this.friction
                this.vy *= this.friction

                this.x += this.vx
                this.y += this.vy

                // Reset acceleration
                this.accX = 0
                this.accY = 0

                // Screen wrap
                if (this.x < 0) this.x = canvas.width
                if (this.x > canvas.width) this.x = 0
                if (this.y < 0) this.y = canvas.height
                if (this.y > canvas.height) this.y = 0
            }
        }

        const particles = Array.from({ length: particleCount }, () => new Particle())

        function animate() {
            // Create a trail effect or clear
            // We'll use clear to keep it sharp like Antigravity
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw background gradient directly on canvas to ensure visibility
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, '#0f172a') // slate-900
            gradient.addColorStop(0.5, '#1e3a8a') // blue-900
            gradient.addColorStop(1, '#111827') // slate-800
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                p.update()
                p.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', setCanvasSize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1]"
            style={{ pointerEvents: 'none' }}
        />
    )
}

export default InteractiveBackground
