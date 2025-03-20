"use client"

import { useEffect, useRef } from "react"

interface Star {
    x: number
    y: number
    radius: number
    vx: number
    vy: number
    connected: boolean
}

export default function ConstellationBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const starsRef = useRef<Star[]>([])
    const animationRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        initStars()
        }

        const initStars = () => {
        const stars: Star[] = []
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 15000)

        for (let i = 0; i < starCount; i++) {
            stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05,
            connected: false,
            })
        }

        starsRef.current = stars
        }

        const drawStars = () => {
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw stars
        starsRef.current.forEach((star) => {
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.5})`
            ctx.fill()

            // Update position
            star.x += star.vx
            star.y += star.vy

            // Bounce off edges
            if (star.x < 0 || star.x > canvas.width) star.vx *= -1
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1

            // Reset connected flag
            star.connected = false
        })

        // Draw connections
        const connectionDistance = Math.min(canvas.width, canvas.height) / 15

        for (let i = 0; i < starsRef.current.length; i++) {
            const star = starsRef.current[i]
            let connections = 0

            for (let j = i + 1; j < starsRef.current.length; j++) {
            if (connections >= 2) break // Limit connections per star

            const otherStar = starsRef.current[j]
            const distance = Math.sqrt(Math.pow(star.x - otherStar.x, 2) + Math.pow(star.y - otherStar.y, 2))

            if (distance < connectionDistance) {
                // Draw line
                ctx.beginPath()
                ctx.moveTo(star.x, star.y)
                ctx.lineTo(otherStar.x, otherStar.y)

                const opacity = 1 - distance / connectionDistance
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`
                ctx.lineWidth = 0.3
                ctx.stroke()

                connections++
                star.connected = true
                otherStar.connected = true
            }
            }
        }

        animationRef.current = requestAnimationFrame(drawStars)
        }

        window.addEventListener("resize", resizeCanvas)
        resizeCanvas()
        drawStars()

        return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationRef.current)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] opacity-70" />
}

