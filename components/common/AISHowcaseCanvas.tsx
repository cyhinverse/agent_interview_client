'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function AISHowcaseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isDark = resolvedTheme === 'dark';

    // Minimal monochrome palette - only subtle violet tones
    const accentColor = isDark ? '139, 92, 246' : '124, 58, 237'; // violet-500 / violet-600
    const neutralColor = isDark ? '161, 161, 170' : '113, 113, 122'; // zinc-400 / zinc-500

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Subtle wave configuration
    const waves = Array.from({ length: 2 }, (_, i) => ({
      y: 0,
      length: 0.008 + i * 0.004,
      amplitude: 15 + i * 10,
      frequency: 0.015 + i * 0.008,
      speed: 0.03 + i * 0.015,
      phase: Math.random() * 100,
    }));

    // Floating Elements - simplified
    interface FloatingItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'dot' | 'text';
      content?: string;
      opacity: number;
      isAccent: boolean;
    }

    let items: FloatingItem[] = [];
    const keywords = [
      'AI Agent',
      'LLM',
      'RAG',
      'Chain',
      'Prompt',
      'Vector',
      'Embedding',
      'Context',
      'Memory',
      'Tool Use',
      'Function',
      'Reasoning',
    ];

    const initItems = () => {
      items = [];
      // Create floating dots and text elements
      for (let i = 0; i < 25; i++) {
        const isText = Math.random() > 0.6;
        items.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: isText ? 14 : Math.random() * 3 + 2,
          type: isText ? 'text' : 'dot',
          content: keywords[Math.floor(Math.random() * keywords.length)],
          opacity: Math.random() * 0.15 + 0.08, // Very subtle: 0.08 - 0.23
          isAccent: Math.random() > 0.7, // 30% chance to be accent colored
        });
      }
    };

    interface Wave {
      y: number;
      length: number;
      amplitude: number;
      frequency: number;
      speed: number;
      phase: number;
    }

    const drawWave = (wave: Wave, index: number, time: number) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.85);

      for (let i = 0; i < canvas.width; i++) {
        const offset =
          Math.sin(i * wave.length + wave.phase + time * wave.speed) *
          wave.amplitude;
        ctx.lineTo(i, canvas.height * 0.85 + offset);
      }

      // Subtle wave with low opacity
      ctx.strokeStyle = `rgba(${accentColor}, ${0.08 - index * 0.03})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timeSec = time / 1000;

      // 1. Draw subtle gradient overlay
      const grad = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.2,
        0,
        canvas.width * 0.8,
        canvas.height * 0.2,
        canvas.width * 0.6
      );
      grad.addColorStop(0, `rgba(${accentColor}, 0.03)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Waves
      waves.forEach((w, i) => drawWave(w, i, timeSec));

      // 3. Draw floating items
      items.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;

        // Wrap around edges
        if (item.x < -100) item.x = canvas.width + 100;
        if (item.x > canvas.width + 100) item.x = -100;
        if (item.y < -100) item.y = canvas.height + 100;
        if (item.y > canvas.height + 100) item.y = -100;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.globalAlpha = item.opacity * 0.4; // Reduced opacity by 60%

        const color = item.isAccent ? accentColor : neutralColor;

        if (item.type === 'text') {
          ctx.font = `500 ${item.size}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = `rgb(${color})`;
          ctx.fillText(item.content || '', 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${color})`;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initItems();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
}
