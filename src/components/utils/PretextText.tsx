import React, { useEffect, useRef, useState } from 'react';
import { layout, prepare } from '@chenglou/pretext';

type PretextFontConfig =
  | string
  | {
      base: string;
      md?: string;
      lg?: string;
    };

interface PretextTextProps {
  as?: React.ElementType;
  text: string;
  className?: string;
  lineHeight: number;
  font: PretextFontConfig;
  children?: React.ReactNode;
}

const preparedCache = new Map<string, ReturnType<typeof prepare>>();

const getPreparedText = (text: string, font: string) => {
  const cacheKey = `${font}::${text}`;
  const cached = preparedCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prepared = prepare(text, font);
  preparedCache.set(cacheKey, prepared);
  return prepared;
};

const getResponsiveFont = (font: PretextFontConfig, viewportWidth: number) => {
  if (typeof font === 'string') {
    return font;
  }

  if (viewportWidth >= 1024 && font.lg) {
    return font.lg;
  }

  if (viewportWidth >= 768 && font.md) {
    return font.md;
  }

  return font.base;
};

const PretextText = ({
  as: Component = 'div',
  text,
  className,
  lineHeight,
  font,
  children,
}: PretextTextProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [metrics, setMetrics] = useState<{ height: number; lineCount: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') {
      return;
    }

    const measure = () => {
      const width = element.clientWidth;
      if (width === 0) {
        return;
      }

      const resolvedFont = getResponsiveFont(font, window.innerWidth);
      const prepared = getPreparedText(text, resolvedFont);
      const result = layout(prepared, width, lineHeight);
      setMetrics(result);
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });
    resizeObserver.observe(element);

    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [font, lineHeight, text]);

  return (
    <Component
      ref={elementRef}
      className={className}
      data-pretext-lines={metrics?.lineCount}
      style={metrics ? { minHeight: `${metrics.height}px` } : undefined}
    >
      {children ?? text}
    </Component>
  );
};

export default PretextText;
