import { useEffect, useRef, useState } from 'react';

type PullMode = 'snake' | 'scatter';

interface ScatterGlyph {
  id: string;
  char: string;
  originX: number;
  originY: number;
  width: number;
  height: number;
  progress: number;
  driftX: number;
  driftY: number;
  rotate: number;
}

interface PullState {
  id: number;
  mode: PullMode;
  text: string;
  rect: DOMRect;
  originX: number;
  originY: number;
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  stretchX: number;
  stretchY: number;
  font: string;
  color: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  fontWeight: string;
  textAlign: string;
  width: number;
  opacity: number;
  releasing: boolean;
  releaseStartAt: number | null;
  glyphs: ScatterGlyph[];
}

const draggableTextSelector = 'h1, h2, h3, h4, h5, h6, p, li, blockquote';
const ignoredSelector = 'button, a, input, textarea, select, label, [data-no-text-pull="true"]';
const segmentStops = [0.12, 0.28, 0.5, 0.72, 0.9];
const modeStorageKey = 'cesium-text-pull-mode';
const maxScatterGlyphs = 72;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;
const mixPoint = (from: { x: number; y: number }, to: { x: number; y: number }, amount: number) => ({
  x: lerp(from.x, to.x, amount),
  y: lerp(from.y, to.y, amount),
});

const isPullMode = (value: string | null): value is PullMode => value === 'snake' || value === 'scatter';

// Measure individual glyph positions so the alternate mode can peel text off the page.
const createScatterGlyphs = (element: HTMLElement): ScatterGlyph[] => {
  const glyphs: ScatterGlyph[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let textNode = walker.nextNode();
  let visibleIndex = 0;

  while (textNode && glyphs.length < maxScatterGlyphs) {
    const content = textNode.textContent ?? '';

    for (let charIndex = 0; charIndex < content.length && glyphs.length < maxScatterGlyphs; charIndex += 1) {
      const char = content[charIndex];
      if (!char.trim()) {
        continue;
      }

      const range = document.createRange();
      range.setStart(textNode, charIndex);
      range.setEnd(textNode, charIndex + 1);
      const rect = range.getBoundingClientRect();
      range.detach();

      if (rect.width < 1 || rect.height < 1) {
        continue;
      }

      const progress = glyphs.length / Math.max(maxScatterGlyphs - 1, 1);
      glyphs.push({
        id: `${visibleIndex}-${char}-${Math.round(rect.left)}-${Math.round(rect.top)}`,
        char,
        originX: rect.left,
        originY: rect.top,
        width: rect.width,
        height: rect.height,
        progress,
        driftX: (Math.random() - 0.5) * 180,
        driftY: 90 + Math.random() * 180,
        rotate: (Math.random() - 0.5) * 140,
      });
      visibleIndex += 1;
    }

    textNode = walker.nextNode();
  }

  return glyphs;
};

const createFallbackScatterGlyphs = (text: string, rect: DOMRect): ScatterGlyph[] =>
  text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxScatterGlyphs)
    .split('')
    .filter((char) => char.trim())
    .map((char, index, list) => ({
      id: `fallback-${index}-${char}`,
      char,
      originX: rect.left + (index / Math.max(list.length, 1)) * Math.max(rect.width - 12, 1),
      originY: rect.top + rect.height * 0.35 + Math.sin(index * 0.4) * 6,
      width: 14,
      height: Math.max(rect.height * 0.8, 18),
      progress: index / Math.max(list.length - 1, 1),
      driftX: (Math.random() - 0.5) * 180,
      driftY: 90 + Math.random() * 180,
      rotate: (Math.random() - 0.5) * 140,
    }));

const TextPullEffect = () => {
  const [mode, setMode] = useState<PullMode>(() => {
    if (typeof window === 'undefined') {
      return 'snake';
    }

    const stored = window.localStorage.getItem(modeStorageKey);
    return isPullMode(stored) ? stored : 'snake';
  });
  const [pullState, setPullState] = useState<PullState | null>(null);
  const [releaseTick, setReleaseTick] = useState(0);

  const activeElementRef = useRef<HTMLElement | null>(null);
  const pullStateRef = useRef<PullState | null>(null);
  const modeRef = useRef<PullMode>(mode);

  useEffect(() => {
    modeRef.current = mode;
    window.localStorage.setItem(modeStorageKey, mode);
  }, [mode]);

  useEffect(() => {
    pullStateRef.current = pullState;
  }, [pullState]);

  useEffect(() => {
    const releasePull = () => {
      const current = pullStateRef.current;
      const activeElement = activeElementRef.current;
      if (!current || !activeElement) {
        return;
      }

      activeElement.classList.remove('text-pull-source-active');

      if (current.mode === 'scatter') {
        const releaseStartedAt = performance.now();
        setPullState({
          ...current,
          releasing: true,
          opacity: 1,
          releaseStartAt: releaseStartedAt,
          pointerX: current.pointerX + (current.pointerX - current.originX) * 0.08,
          pointerY: current.pointerY - 12,
        });
        return;
      }

      setPullState({
        ...current,
        releasing: true,
        opacity: 0,
        pointerX: current.originX,
        pointerY: current.originY,
        rotation: 0,
        stretchX: 1,
        stretchY: 1,
      });

      window.setTimeout(() => {
        setPullState((next) => (next?.id === current.id ? null : next));
        activeElementRef.current = null;
      }, 220);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target || target.closest(ignoredSelector)) {
        return;
      }

      const element = target.closest(draggableTextSelector) as HTMLElement | null;
      if (!element) {
        return;
      }

      const text = element.innerText.replace(/\s+/g, ' ').trim();
      if (!text) {
        return;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 18) {
        return;
      }

      const computedStyle = window.getComputedStyle(element);
      const previewText = text.length > 140 ? `${text.slice(0, 137)}...` : text;
      const nextMode = modeRef.current;
      const measuredGlyphs = nextMode === 'scatter' ? createScatterGlyphs(element) : [];

      activeElementRef.current?.classList.remove('text-pull-source-active');
      activeElementRef.current = element;
      element.classList.add('text-pull-source-active');

      setPullState({
        id: Date.now(),
        mode: nextMode,
        text: previewText,
        rect,
        originX: rect.left,
        originY: rect.top,
        pointerX: event.clientX,
        pointerY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        rotation: 0,
        stretchX: 1,
        stretchY: 1,
        font: computedStyle.font,
        color: computedStyle.color,
        lineHeight: computedStyle.lineHeight,
        letterSpacing: computedStyle.letterSpacing,
        textTransform: computedStyle.textTransform,
        fontWeight: computedStyle.fontWeight,
        textAlign: computedStyle.textAlign as PullState['textAlign'],
        width: Math.min(Math.max(rect.width, 160), 520),
        opacity: 1,
        releasing: false,
        releaseStartAt: null,
        glyphs: measuredGlyphs.length > 0 ? measuredGlyphs : createFallbackScatterGlyphs(previewText, rect),
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      setPullState((current) => {
        if (!current || current.releasing) {
          return current;
        }

        const dx = event.clientX - (current.rect.left + current.offsetX);
        const dy = event.clientY - (current.rect.top + current.offsetY);

        return {
          ...current,
          pointerX: event.clientX,
          pointerY: event.clientY,
          rotation: clamp(dx * 0.045, -18, 18),
          stretchX: 1 + clamp(Math.abs(dx), 0, 220) / 240,
          stretchY: 1 - clamp(Math.abs(dx), 0, 120) / 700 + clamp(Math.abs(dy), 0, 120) / 1200,
        };
      });
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', releasePull);
    window.addEventListener('pointercancel', releasePull);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', releasePull);
      window.removeEventListener('pointercancel', releasePull);
      activeElementRef.current?.classList.remove('text-pull-source-active');
    };
  }, []);

  useEffect(() => {
    if (!pullState?.releasing || pullState.mode !== 'scatter' || pullState.releaseStartAt === null) {
      return;
    }

    let frame = 0;
    const animate = () => {
      setReleaseTick(performance.now());
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [pullState?.id, pullState?.mode, pullState?.releasing, pullState?.releaseStartAt]);

  useEffect(() => {
    if (!pullState?.releasing || pullState.mode !== 'scatter' || pullState.releaseStartAt === null) {
      return;
    }

    if (releaseTick - pullState.releaseStartAt > 820) {
      setPullState((current) => (current?.id === pullState.id ? null : current));
      activeElementRef.current = null;
    }
  }, [pullState, releaseTick]);

  const renderControls = (
    <div className="text-pull-controls" data-no-text-pull="true">
      <span className="text-pull-controls-label">Text FX</span>
      <button
        type="button"
        className={`text-pull-control ${mode === 'snake' ? 'is-active' : ''}`}
        onClick={() => setMode('snake')}
        data-no-text-pull="true"
      >
        Snake
      </button>
      <button
        type="button"
        className={`text-pull-control ${mode === 'scatter' ? 'is-active' : ''}`}
        onClick={() => setMode('scatter')}
        data-no-text-pull="true"
      >
        Scatter
      </button>
    </div>
  );

  if (!pullState) {
    return renderControls;
  }

  const left = pullState.pointerX - pullState.offsetX;
  const top = pullState.pointerY - pullState.offsetY;
  const headX = left;
  const headY = top;
  const trailDx = headX - pullState.originX;
  const trailDy = headY - pullState.originY;
  const travelDistance = Math.hypot(trailDx, trailDy);
  const releaseProgress =
    pullState.releasing && pullState.releaseStartAt !== null
      ? clamp((releaseTick - pullState.releaseStartAt) / 820, 0, 1)
      : 0;
  const snakeChars = pullState.text
    .replace(/\s+/g, '')
    .slice(0, 26)
    .split('');
  const startPoint = { x: pullState.originX + 18, y: pullState.originY + pullState.rect.height * 0.48 };
  const endPoint = { x: headX + 20, y: headY + pullState.rect.height * 0.38 };
  const normalX = travelDistance > 0 ? -trailDy / travelDistance : 0;
  const normalY = travelDistance > 0 ? trailDx / travelDistance : -1;
  const controlA = {
    x: startPoint.x + trailDx * 0.22 + normalX * clamp(travelDistance * 0.12, 10, 70),
    y: startPoint.y + trailDy * 0.18 + normalY * clamp(travelDistance * 0.12, 10, 70),
  };
  const controlB = {
    x: startPoint.x + trailDx * 0.68 - normalX * clamp(travelDistance * 0.16, 12, 92),
    y: startPoint.y + trailDy * 0.72 - normalY * clamp(travelDistance * 0.16, 12, 92),
  };

  return (
    <>
      {renderControls}
      <div className="text-pull-layer" aria-hidden="true">
        {pullState.mode === 'snake' ? (
          <>
            {segmentStops.map((stop, index) => {
              const segmentX = lerp(pullState.originX, headX, stop);
              const segmentY =
                lerp(pullState.originY, headY, stop) +
                Math.sin(stop * Math.PI * 2.5) * clamp(travelDistance * 0.08, 8, 22);
              const progress = (index + 1) / segmentStops.length;

              return (
                <div
                  key={`${pullState.id}-${stop}`}
                  className={`text-pull-ghost text-pull-segment ${pullState.releasing ? 'is-releasing' : ''}`}
                  style={{
                    left: segmentX,
                    top: segmentY,
                    width: clamp(pullState.width * (0.18 + progress * 0.1), 80, 180),
                    opacity: pullState.opacity * (0.08 + progress * 0.1),
                    transform: `translate3d(0, 0, 0) rotate(${pullState.rotation * progress * 0.6}deg) scale(${0.94 + progress * 0.15}, ${0.8 + progress * 0.1})`,
                    font: pullState.font,
                    color: pullState.color,
                    lineHeight: pullState.lineHeight,
                    letterSpacing: pullState.letterSpacing,
                    textTransform: pullState.textTransform,
                    fontWeight: pullState.fontWeight,
                    textAlign: 'center',
                    filter: `blur(${(1 - progress) * 2.1}px)`,
                  }}
                >
                  {pullState.text.slice(0, 10)}
                </div>
              );
            })}

            <div className="text-snake-layer">
              {snakeChars.map((char, index) => {
                const progress = index / Math.max(snakeChars.length - 1, 1);
                const p0 = mixPoint(startPoint, controlA, progress);
                const p1 = mixPoint(controlA, controlB, progress);
                const p2 = mixPoint(controlB, endPoint, progress);
                const p3 = mixPoint(p0, p1, progress);
                const p4 = mixPoint(p1, p2, progress);
                const point = mixPoint(p3, p4, progress);

                const nextProgress = clamp(progress + 0.035, 0, 1);
                const np0 = mixPoint(startPoint, controlA, nextProgress);
                const np1 = mixPoint(controlA, controlB, nextProgress);
                const np2 = mixPoint(controlB, endPoint, nextProgress);
                const np3 = mixPoint(np0, np1, nextProgress);
                const np4 = mixPoint(np1, np2, nextProgress);
                const nextPoint = mixPoint(np3, np4, nextProgress);

                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                const taper = 0.52 + progress * 0.7;
                const wave = Math.sin(progress * Math.PI * 4 + travelDistance * 0.025) * clamp(travelDistance * 0.035, 0, 12);
                const x = point.x + normalX * wave;
                const y = point.y + normalY * wave;

                return (
                  <span
                    key={`${pullState.id}-snake-${index}-${char}`}
                    className="text-snake-glyph"
                    style={{
                      left: x,
                      top: y,
                      opacity: 0.28 + progress * 0.72,
                      transform: `translate3d(0, 0, 0) rotate(${angle}deg) scale(${taper})`,
                      font: pullState.font,
                      color: progress > 0.82 ? '#ffe6a6' : pullState.color,
                      lineHeight: pullState.lineHeight,
                      letterSpacing: pullState.letterSpacing,
                      textTransform: pullState.textTransform,
                      fontWeight: pullState.fontWeight,
                      textShadow: progress > 0.8 ? '0 0 20px rgba(255, 226, 150, 0.32)' : '0 0 8px rgba(255, 226, 150, 0.12)',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            <div
              key={pullState.id}
              className={`text-pull-ghost text-pull-head ${pullState.releasing ? 'is-releasing' : ''}`}
              style={{
                left: headX,
                top: headY,
                width: clamp(pullState.width * 0.28, 120, 220),
                opacity: pullState.opacity,
                transform: `translate3d(0, 0, 0) rotate(${pullState.rotation}deg) scale(${1 + clamp(travelDistance, 0, 240) / 520}, ${0.9 + clamp(travelDistance, 0, 180) / 900})`,
                font: pullState.font,
                color: '#fff4cf',
                lineHeight: pullState.lineHeight,
                letterSpacing: pullState.letterSpacing,
                textTransform: pullState.textTransform,
                fontWeight: pullState.fontWeight,
                textAlign: 'center',
                boxShadow: `${clamp(Math.abs(trailDx) / 6, 10, 30)}px ${clamp(Math.abs(trailDy) / 8, 6, 20)}px 40px rgba(0, 0, 0, 0.35)`,
              }}
            >
              {snakeChars.at(-1) ?? pullState.text.charAt(0)}
            </div>
          </>
        ) : (
          <div className="text-scatter-layer">
            {pullState.glyphs.map((glyph, index) => {
              const progress = 0.08 + glyph.progress * 0.92;
              const curve = Math.sin(progress * Math.PI) * clamp(Math.hypot(trailDx, trailDy) * 0.18, 14, 120);
              const dragX = lerp(glyph.originX, pullState.pointerX - glyph.width * 0.5, progress);
              const dragY = lerp(glyph.originY, pullState.pointerY - glyph.height * 0.5, progress) - curve;
              const fallX = dragX + glyph.driftX * releaseProgress;
              const fallY = dragY + glyph.driftY * releaseProgress * releaseProgress;
              const scale = 1 + (1 - progress) * 0.12 - releaseProgress * 0.08;
              const opacity = clamp(1 - releaseProgress * 1.15 + progress * 0.18, 0, 1);
              const blur = releaseProgress * 1.8;
              const rotate = pullState.releasing
                ? glyph.rotate * releaseProgress
                : clamp(trailDx * 0.04 * (0.2 + progress), -24, 24);

              return (
                <span
                  key={`${pullState.id}-${glyph.id}-${index}`}
                  className="text-scatter-glyph"
                  style={{
                    left: fallX,
                    top: fallY,
                    opacity,
                    transform: `translate3d(0, 0, 0) rotate(${rotate}deg) scale(${scale})`,
                    font: pullState.font,
                    color: pullState.color,
                    lineHeight: pullState.lineHeight,
                    letterSpacing: pullState.letterSpacing,
                    textTransform: pullState.textTransform,
                    fontWeight: pullState.fontWeight,
                    textAlign: pullState.textAlign,
                    filter: `blur(${blur}px)`,
                    textShadow: progress > 0.76 ? '0 0 18px rgba(255, 232, 170, 0.28)' : '0 0 10px rgba(255, 232, 170, 0.12)',
                  }}
                >
                  {glyph.char}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default TextPullEffect;
