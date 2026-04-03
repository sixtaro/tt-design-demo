import React, { useEffect, useMemo, useRef, useState } from 'react';

const svgCache = new Map();

const colorReplacements = [
  ['#3F78D6', 'var(--tt-color-primary-6)'],
  ['#72A0E8', 'var(--tt-color-primary-4)'],
  ['#3981F7', 'var(--tt-color-primary-6)'],
  ['#B7D2FF', 'var(--tt-color-primary-2)'],
  ['#93BBFF', 'var(--tt-color-primary-3)'],
  ['#A2D2FE', 'var(--tt-color-primary-3)'],
  ['#5E9BFF', 'var(--tt-color-primary-4)'],
  ['#E2EDFF', 'var(--tt-color-primary-1)'],
  ['#8CB7FF', 'var(--tt-color-primary-3)'],
  ['#EEF4FF', 'var(--tt-color-primary-1)'],
  ['#99C0FF', 'var(--tt-color-primary-3)'],
  ['#0052D9', 'var(--tt-color-primary-7)'],
  ['#66A1FF', 'var(--tt-color-primary-4)'],
  ['#89A3FE', 'var(--tt-color-primary-3)'],
  ['#B4C4FE', 'var(--tt-color-primary-2)'],
  ['#B0CDFF', 'var(--tt-color-primary-2)'],
  ['#B5D1FF', 'var(--tt-color-primary-2)'],
  ['#B3D0FF', 'var(--tt-color-primary-2)'],
  ['#B3C3FF', 'var(--tt-color-primary-2)'],
  ['#D4E4FF', 'var(--tt-color-primary-1)'],
  ['#EFF5FF', 'var(--tt-color-primary-1)'],
  ['#EDF1FF', 'var(--tt-color-primary-1)'],
  ['#E6ECFF', 'var(--tt-color-primary-1)'],
  ['#E0ECFF', 'var(--tt-color-primary-1)'],
  ['#DFE6FF', 'var(--tt-color-primary-1)'],
  ['#C6D2FF', 'var(--tt-color-primary-2)'],
  ['#9EBDEF', 'var(--tt-color-primary-3)'],
  ['#FAFBFF', 'var(--tt-bg-white)'],
  ['#F6F8FF', 'var(--tt-bg-white)'],
  ['#F1F4FF', 'var(--tt-color-primary-1)'],
  ['#B2D3FF', 'var(--tt-color-primary-2)'],
  ['#B1CEFF', 'var(--tt-color-primary-2)'],
  ['#A9D0FF', 'var(--tt-color-primary-2)'],
  ['#91BBFF', 'var(--tt-color-primary-3)'],
  ['#8FBAFF', 'var(--tt-color-primary-3)'],
  ['#82B1FF', 'var(--tt-color-primary-3)'],
  ['#7DAFFF', 'var(--tt-color-primary-4)'],
  ['#77AAFF', 'var(--tt-color-primary-4)'],
  ['#73A9FF', 'var(--tt-color-primary-4)'],
  ['#72A8FF', 'var(--tt-color-primary-4)'],
  ['#71A2F2', 'var(--tt-color-primary-4)'],
  ['#67A1FD', 'var(--tt-color-primary-4)'],
  ['#6A9BED', 'var(--tt-color-primary-5)'],
  ['#659FFF', 'var(--tt-color-primary-5)'],
  ['#5B7FFF', 'var(--tt-color-primary-6)'],
  ['#4E92FF', 'var(--tt-color-primary-6)'],
  ['#4D89EC', 'var(--tt-color-primary-6)'],
  ['#4484EF', 'var(--tt-color-primary-6)'],
  ['#4286F5', 'var(--tt-color-primary-6)'],
  ['#7492FF', 'var(--tt-color-primary-5)'],
  ['#5577F0', 'var(--tt-color-primary-6)'],
  ['#496AE0', 'var(--tt-color-primary-7)'],
  ['#FD6300', 'var(--tt-color-primary-5)'],
  ['#FFE2D7', 'var(--tt-color-primary-1)'],
  ['#FFC9A9', 'var(--tt-color-primary-2)'],
  ['#FFFAF4', 'var(--tt-color-primary-1)'],
  ['#F2F7FF', 'var(--tt-bg-white)'],
  ['#F9FAFF', 'var(--tt-bg-white)'],
];

const loadSvgText = async (src) => {
  if (!svgCache.has(src)) {
    svgCache.set(
      src,
      fetch(src).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load svg: ${src}`);
        }

        return response.text();
      })
    );
  }

  return svgCache.get(src);
};

const applyThemeTokens = (markup, suffix) => {
  let nextMarkup = markup;
  const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g)).map((match) => match[1]);

  ids.forEach((id) => {
    const nextId = `${id}-${suffix}`;
    nextMarkup = nextMarkup.split(`id="${id}"`).join(`id="${nextId}"`);
    nextMarkup = nextMarkup.split(`url(#${id})`).join(`url(#${nextId})`);
  });

  colorReplacements.forEach(([from, to]) => {
    nextMarkup = nextMarkup.split(from).join(to);
  });

  nextMarkup = nextMarkup.replace(/\sfill="(var\(--tt-[^)]+\))"/g, ' style="fill: $1" fill="$1"');
  nextMarkup = nextMarkup.replace(/\sstroke="(var\(--tt-[^)]+\))"/g, ' style="stroke: $1" stroke="$1"');
  nextMarkup = nextMarkup.replace(/\sstop-color="(var\(--tt-[^)]+\))"/g, ' style="stop-color: $1" stop-color="$1"');

  return nextMarkup.replace('<svg ', '<svg class="tt-empty-themed-svg" ');
};

const ThemedSvgIllustration = ({ src, markup, className, style }) => {
  const uniqueIdRef = useRef(`tt-empty-svg-${Math.random().toString(36).slice(2, 10)}`);
  const [svgMarkup, setSvgMarkup] = useState('');

  useEffect(() => {
    let active = true;

    if (markup) {
      setSvgMarkup(applyThemeTokens(markup, uniqueIdRef.current));
    } else if (src) {
      loadSvgText(src)
        .then((text) => {
          if (active) {
            setSvgMarkup(applyThemeTokens(text, uniqueIdRef.current));
          }
        })
        .catch(() => {
          if (active) {
            setSvgMarkup('');
          }
        });
    } else {
      setSvgMarkup('');
    }

    return () => {
      active = false;
    };
  }, [src, markup]);

  const wrapperClassName = useMemo(
    () => ['tt-empty-themed-illustration', className].filter(Boolean).join(' '),
    [className]
  );

  return (
    <span
      className={wrapperClassName}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default ThemedSvgIllustration;
