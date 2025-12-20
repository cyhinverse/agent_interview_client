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

    const colors = {
      primary: '168, 85, 247',
      secondary: '139, 92, 246',
      accent: '192, 132, 252',
      text: isDark ? '255, 255, 255' : '0, 0, 0',
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // --- Waveform logic ---
    const waves = Array.from({ length: 3 }, (_, i) => ({
      y: 0,
      length: 0.01 + i * 0.005,
      amplitude: 20 + i * 15,
      frequency: 0.02 + i * 0.01,
      speed: 0.05 + i * 0.02,
      phase: Math.random() * 100,
    }));

    // --- Floating Elements ---
    interface FloatingItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'panel' | 'code' | 'point' | 'leet';
      content?: string;
      opacity: number;
      color: string;
    }

    let items: FloatingItem[] = [];
    const leetContent = [
      'Sliding Window',
      'Two Pointers',
      'Fast & Slow',
      'BFS',
      'DFS',
      'Backtracking',
      'Dynamic Programming',
      'Greedy',
      'Trie',
      'Two Sum',
      '3Sum',
      'Add Two Numbers',
      'Valid Parentheses',
      'Merge Intervals',
      'Top K Elements',
      'Subsets',
      'Binary Search',
      'Tree Traversal',
      'Graph Search',
      'LRU Cache',
      'Two Heaps',
    ];

    const randomColors = [
      '147, 51, 234', // Rich Purple
      '124, 58, 237', // Deep Violet
      '219, 39, 119', // Vibrant Pink
      '37, 99, 235', // Bold Blue
      '5, 150, 105', // Vivid Emerald
      '217, 119, 6', // Warm Orange
      '220, 38, 38', // Strong Red
    ];

    const initItems = () => {
      items = [];
      for (let i = 0; i < 35; i++) {
        items.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 80 + 40,
          type:
            Math.random() > 0.85
              ? 'panel'
              : Math.random() > 0.2
              ? 'leet'
              : 'point',
          content: leetContent[Math.floor(Math.random() * leetContent.length)],
          opacity: Math.random() * 0.4 + 0.5, // Increased base opacity (0.5 to 0.9)
          color: randomColors[Math.floor(Math.random() * randomColors.length)],
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
      ctx.moveTo(0, canvas.height * 0.8);

      for (let i = 0; i < canvas.width; i++) {
        const offset =
          Math.sin(i * wave.length + wave.phase + time * wave.speed) *
          wave.amplitude;
        ctx.lineTo(i, canvas.height * 0.8 + offset);
      }

      ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 - index * 0.08})`; // Even brighter waves
      ctx.lineWidth = 4;
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timeSec = time / 1000;

      // 1. Draw Waves
      waves.forEach((w, i) => drawWave(w, i, timeSec));

      // 2. Draw Items
      items.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;

        if (item.x < -100) item.x = canvas.width + 100;
        if (item.x > canvas.width + 100) item.x = -100;
        if (item.y < -100) item.y = canvas.height + 100;
        if (item.y > canvas.height + 100) item.y = -100;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.globalAlpha = item.opacity;

        if (item.type === 'panel') {
          // Glass panel - making it more premium
          ctx.beginPath();
          ctx.roundRect(0, 0, item.size, item.size * 0.6, 12);
          ctx.fillStyle = `rgba(${item.color}, 0.25)`; // Increased opacity
          ctx.fill();
          ctx.strokeStyle = `rgba(${item.color}, 0.6)`; // Sharper, more visible border
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(10, 20);
          ctx.lineTo(item.size - 10, 20);
          ctx.strokeStyle = `rgba(${item.color}, 0.4)`;
          ctx.stroke();
        } else if (item.type === 'leet') {
          ctx.font = 'bold 16px sans-serif'; // Slightly larger
          ctx.fillStyle = `rgb(${item.color})`;
          ctx.shadowBlur = 25; // Much stronger glow
          ctx.shadowColor = `rgba(${item.color}, 0.9)`;
          ctx.fillText(item.content || '', 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2); // Larger points
          ctx.fillStyle = `rgb(${item.color})`;
          ctx.shadowBlur = 30;
          ctx.shadowColor = `rgb(${item.color})`;
          ctx.fill();
        }
        ctx.restore();
      });

      // 3. Cinematic Gradients (Corners) - More intense
      const grad = ctx.createRadialGradient(
        canvas.width,
        0,
        0,
        canvas.width,
        0,
        canvas.width
      );
      grad.addColorStop(0, `rgba(${colors.primary}, 0.15)`); // Increased density
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-100" // Increased opacity and moved to z-0
    />
  );
}
