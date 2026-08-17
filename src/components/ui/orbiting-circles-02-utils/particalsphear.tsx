'use client';

import { useEffect, useRef } from 'react';

type SpherePoint = {
  x: number;
  y: number;
  z: number;
  size: number;
  tint: number;
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function createSpherePoints(count: number): SpherePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = GOLDEN_ANGLE * index;

    return {
      x: Math.cos(angle) * radius,
      y,
      z: Math.sin(angle) * radius,
      size: 0.7 + ((index * 17) % 11) / 10,
      tint: (index * 29) % 100,
    };
  });
}

const POINTS = createSpherePoints(1600);

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const sphereRadius = Math.min(width, height) * 0.43;
      const rotationY = reduceMotion ? -0.38 : time * 0.00012;
      const rotationX = -0.26 + (reduceMotion ? 0 : Math.sin(time * 0.0002) * 0.035);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const halo = context.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.12,
        centerX,
        centerY,
        sphereRadius,
      );
      halo.addColorStop(0, 'rgba(120, 225, 255, 0.12)');
      halo.addColorStop(0.58, 'rgba(18, 91, 116, 0.05)');
      halo.addColorStop(1, 'rgba(4, 20, 28, 0)');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      context.fill();

      const projected = POINTS.map((point) => {
        const rotatedX = point.x * cosY - point.z * sinY;
        const rotatedZ = point.x * sinY + point.z * cosY;
        const tiltedY = point.y * cosX - rotatedZ * sinX;
        const tiltedZ = point.y * sinX + rotatedZ * cosX;
        const perspective = 1 / (1.82 - tiltedZ * 0.34);

        return {
          x: centerX + rotatedX * sphereRadius * perspective * 1.58,
          y: centerY + tiltedY * sphereRadius * perspective * 1.58,
          z: tiltedZ,
          size: point.size * perspective,
          tint: point.tint,
        };
      }).sort((a, b) => a.z - b.z);

      for (const point of projected) {
        const depth = (point.z + 1) / 2;
        const alpha = 0.12 + depth * 0.8;
        const radius = Math.max(0.45, point.size * (0.72 + depth * 1.15));
        const cyan = point.tint > 68;

        context.fillStyle = cyan
          ? `rgba(73, 214, 246, ${alpha})`
          : `rgba(236, 249, 255, ${alpha})`;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      const rim = context.createLinearGradient(
        centerX - sphereRadius,
        centerY - sphereRadius,
        centerX + sphereRadius,
        centerY + sphereRadius,
      );
      rim.addColorStop(0, 'rgba(255,255,255,0.08)');
      rim.addColorStop(0.45, 'rgba(105,224,255,0.45)');
      rim.addColorStop(1, 'rgba(255,255,255,0.06)');
      context.strokeStyle = rim;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, sphereRadius * 0.88, 0, Math.PI * 2);
      context.stroke();

      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    observer.observe(canvas);
    draw(0);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-sphere" aria-hidden="true" />;
}
