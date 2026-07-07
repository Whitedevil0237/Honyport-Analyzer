import React, { useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
const CHAR_ARRAY = CHARACTERS.split('');

interface MatrixRainProps {
  opacity?: number;
}

export function MatrixRain({ opacity = 0.2 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 14;
    let columns = width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start at random positions above screen
    }

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(5, 10, 5, 0.1)`; 
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41'; // Neon green
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = CHAR_ARRAY[Math.floor(Math.random() * CHAR_ARRAY.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Add some random brightness variation
        if (Math.random() > 0.9) {
          ctx.fillStyle = '#fff'; // Bright white for some characters
        } else {
          ctx.fillStyle = '#00ff41';
        }
        
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    let animationFrameId: number;
    let lastDrawTime = 0;
    const fps = 30; // Matrix runs better slightly slower
    const interval = 1000 / fps;

    const render = (time: number) => {
      if (time - lastDrawTime > interval) {
        draw();
        lastDrawTime = time;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      // Refill drops array if screen gets wider
      while (drops.length < columns) {
        drops.push(Math.random() * -100);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
}
