'use client';

import React, { type RefObject, useEffect, useId, useMemo, useRef } from 'react';
import {
  motion,
  type MotionValue,
  type SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

import { cn } from '@/lib/utils';

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatio =
  | 'none'
  | `${'xMin' | 'xMid' | 'xMax'}${'YMin' | 'YMid' | 'YMax'}${'' | ' meet' | ' slice'}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  baseVelocity?: number;
  direction?: 'normal' | 'reverse';
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;
  repeat?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
  responsive?: boolean;
}

interface PathItemProps {
  child: React.ReactNode;
  itemIndex: number;
  itemCount: number;
  repeated: boolean;
  path: string;
  baseOffset: MotionValue<number>;
  easing?: (value: number) => number;
  enableRollingZIndex: boolean;
  zIndexBase: number;
  zIndexRange: number;
  draggable: boolean;
  grabCursor: boolean;
  onHoverChange: (hovered: boolean) => void;
}

function PathItem({
  child,
  itemIndex,
  itemCount,
  repeated,
  path,
  baseOffset,
  easing,
  enableRollingZIndex,
  zIndexBase,
  zIndexRange,
  draggable,
  grabCursor,
  onHoverChange,
}: PathItemProps) {
  const itemOffset = useTransform(baseOffset, (value) => {
    const position = (itemIndex * 100) / itemCount;
    const wrapped = wrap(0, 100, value + position);
    return `${easing ? easing(wrapped / 100) * 100 : wrapped}%`;
  });
  const zIndex = useTransform(itemOffset, (value) => {
    const distance = Number.parseFloat(value);
    return Math.floor(zIndexBase + (distance / 100) * zIndexRange);
  });

  return (
    <motion.div
      className={cn('marquee-path__item', draggable && grabCursor && 'is-grabbable')}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: 'offset-distance',
        backfaceVisibility: 'hidden',
      }}
      aria-hidden={repeated || undefined}
      inert={repeated || undefined}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {child}
    </motion.div>
  );
}

export default function MarqueeAlongSvgPath({
  children,
  className,
  path,
  pathId,
  preserveAspectRatio = 'xMidYMid meet',
  showPath = false,
  width = '100%',
  height = '100%',
  viewBox = '0 0 100 100',
  baseVelocity = 5,
  direction = 'normal',
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  responsive = false,
}: MarqueeAlongSvgPathProps) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const generatedId = useId().replaceAll(':', '');
  const id = pathId || `marquee-path-${generatedId}`;

  const items = useMemo(() => {
    const childArray = React.Children.toArray(children);
    return Array.from({ length: repeat }, (_, repeatIndex) =>
      childArray.map((child, childIndex) => ({
        child,
        repeated: repeatIndex > 0,
        key: `${childIndex}-${repeatIndex}`,
      })),
    ).flat();
  }, [children, repeat]);

  useEffect(() => {
    if (!responsive) return;
    const containerElement = container.current;
    const canvasElement = canvas.current;
    if (!containerElement || !canvasElement) return;
    const [, , viewBoxWidth = 100, viewBoxHeight = 100] = viewBox.split(' ').map(Number);

    const updateScale = () => {
      const scale = Math.min(
        containerElement.clientWidth / viewBoxWidth,
        containerElement.clientHeight / viewBoxHeight,
      );
      const scaledWidth = viewBoxWidth * scale;
      const scaledHeight = viewBoxHeight * scale;
      canvasElement.style.width = `${viewBoxWidth}px`;
      canvasElement.style.height = `${viewBoxHeight}px`;
      canvasElement.style.transform = `translate(${(containerElement.clientWidth - scaledWidth) / 2}px, ${(containerElement.clientHeight - scaledHeight) / 2}px) scale(${scale})`;
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerElement);
    return () => observer.disconnect();
  }, [responsive, viewBox]);

  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  });
  const smoothVelocity = useSpring(useVelocity(scrollY), scrollSpringConfig);
  const hoverFactor = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactor, slowDownSpringConfig);
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0 });
  const directionFactor = useRef(direction === 'normal' ? 1 : -1);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    hoverFactor.set(isHovered.current && slowdownOnHover ? slowDownFactor : 1);

    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      return;
    }

    const scrollFactor = useScrollVelocity ? smoothVelocity.get() / 1000 : 0;
    if (scrollAwareDirection && Math.abs(scrollFactor) > 0.01) {
      directionFactor.current = Math.sign(scrollFactor);
    }
    if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
      directionFactor.current = Math.sign(dragVelocity.current);
    }

    const movement =
      directionFactor.current * baseVelocity * (delta / 1000) * smoothHoverFactor.get() * (1 + Math.abs(scrollFactor));
    baseOffset.set(baseOffset.get() + movement + dragVelocity.current);

    if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
      dragVelocity.current *= dragVelocityDecay;
    }
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if ((event.target as Element).closest('button, a, input, textarea, select, [role="button"]')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    isDragging.current = true;
    dragVelocity.current = 0;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !isDragging.current) return;
    const deltaX = event.clientX - lastPointer.current.x;
    const deltaY = event.clientY - lastPointer.current.y;
    dragVelocity.current = Math.sign(deltaX || 1) * Math.hypot(deltaX, deltaY) * dragSensitivity;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isDragging.current = false;
  };

  return (
    <div
      ref={container}
      className={cn('marquee-path', grabCursor && draggable && 'is-grabbable', className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div ref={canvas} className="marquee-path__canvas">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="marquee-path__svg"
          aria-hidden="true"
        >
          <path id={id} d={path} stroke={showPath ? 'currentColor' : 'none'} fill="none" />
        </svg>

        {items.map((item, index) => (
          <PathItem
            key={item.key}
            child={item.child}
            itemIndex={index}
            itemCount={items.length}
            repeated={item.repeated}
            path={path}
            baseOffset={baseOffset}
            easing={easing}
            enableRollingZIndex={enableRollingZIndex}
            zIndexBase={zIndexBase}
            zIndexRange={zIndexRange}
            draggable={draggable}
            grabCursor={grabCursor}
            onHoverChange={(hovered) => {
              isHovered.current = hovered;
            }}
          />
        ))}
      </div>
    </div>
  );
}
