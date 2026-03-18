import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { hsvToRgb, rgbToHex, rgbToHsv, hsvToHsl, hslToHsv, hexToRgba, hslToRgb, isValidColor } from './utils/colorConverters.js'
import { MAX_RECENT_COLORS, MIN_GRADIENT_STOPS, hexOption, optionsRGBA, commonColorRows, commonGradients } from './utils/colorConfiguration.js'
import { getFromStorage, saveToStorage } from './utils/storageUtils.js'
import useDragHandler from './utils/useDragHandler.js'
import PureColorPanel from './components/PureColorPanel.js'
import GradientColorPanel from './components/GradientColorPanel.js'
import { BgColorsOutlined } from '@ant-design/icons';
import { componentVersions } from '../../utils/version-config';
import { Popover, Radio, Divider, Button } from '../index';
import './index.less';

const getInitialStatus = initialColor => {
  return initialColor.includes('linear-gradient') ? 'gradient' : 'pure';
};

const ColorPicker = (props) => {
  const { initialColor = '#000000', onChange, value, onValueChange, showIcon = false, prefix = <BgColorsOutlined />, showStatus = true, initialStatus = 'pure', debounceTime = 100 } = props;
  const initialRgba = hexToRgba(initialColor);
  const initialHsv = rgbToHsv(initialRgba.r, initialRgba.g, initialRgba.b);
  const initialRgb = { r: initialRgba.r, g: initialRgba.g, b: initialRgba.b };

  const loadRecentPureColors = useCallback(() => {
    const saved = getFromStorage('recentPureColors', []);
    return saved.map(item => typeof item === 'string' && item.startsWith('#') ? { type: 'pure', color: item } : item);
  }, []);

  const loadRecentGradientColors = useCallback(() => {
    return getFromStorage('recentGradientColors', []);
  }, [])

  const [hsv, setHsv] = useState(initialHsv);
  const [alpha, setAlpha] = useState(initialRgba.a);
  const [color, setColor] = useState(value || initialColor);
  const [inputColor, setInputColor] = useState(value || initialColor);
  const [status, setStatus] = useState(initialStatus);
  const [hexOrCss, setHexOrCss] = useState('HEX');
  const [labelRGBA, setLabelRGBA] = useState('RGBA');
  const [valueRGBA, setValueRGBA] = useState([0, 0, 0, 0]);
  const [currentRgb, setCurrentRgb] = useState(initialRgb);
  const [recentPureColors, setRecentPureColors] = useState(loadRecentPureColors);
  const [recentGradientColors, setRecentGradientColors] = useState(loadRecentGradientColors);
  const [gradientStops, setGradientStops] = useState(initialStatus === 'gradient' ? [
    { position: 0, hsv: { ...initialHsv }, alpha: initialRgba.a },
    { position: 1, hsv: { ...initialHsv }, alpha: initialRgba.a }
  ] : []);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(0);

  const saturationRef = useRef(null);
  const hueRef = useRef(null);
  const alphaRef = useRef(null);
  const gradientBarRef = useRef(null);
  const colorRef = useRef(color);
  const lastValidHueRef = useRef(initialHsv.h);

  const debounceTimerRef = useRef(null);
  const latestColorRef = useRef(color);
  const lastOutputRef = useRef('');

  useEffect(() => {
    latestColorRef.current = color;
  }, [color]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  const convertToAARRGGBB = useCallback((colorValue, currentAlpha) => {
    if (!colorValue || !colorValue.startsWith('#')) {
      return colorValue;
    }

    if (colorValue.startsWith('#') && colorValue.length === 7) {
      const alphaValue = Math.round(currentAlpha * 255);
      const alphaHex = alphaValue.toString(16).padStart(2, '0').toUpperCase();
      return `#${colorValue.slice(1)}${alphaHex}`;
    }

    if (colorValue.startsWith('#') && colorValue.length === 9) {
      return colorValue.toUpperCase();
    }

    return colorValue;
  }, []);

  const displayColor = useMemo(() => {
    if (status === 'pure' && hexOrCss === 'HEX' && color.startsWith('#')) {
      return convertToAARRGGBB(color, alpha);
    }
    return color;
  }, [color, status, hexOrCss, alpha, convertToAARRGGBB]);

  const debouncedOnChange = useCallback((colorValue, currentAlpha) => {
    if (debounceTime === 0) {
      let outputColor = colorValue;
      if (status === 'pure' && hexOrCss === 'HEX' && colorValue.startsWith('#')) {
        outputColor = convertToAARRGGBB(colorValue, currentAlpha);
      }
      onChange?.(outputColor);
      onValueChange?.(outputColor);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      let outputColor = colorValue;
      if (status === 'pure' && hexOrCss === 'HEX' && colorValue.startsWith('#')) {
        outputColor = convertToAARRGGBB(colorValue, currentAlpha);
      }
      onChange?.(outputColor);
      onValueChange?.(outputColor);
    }, debounceTime);
  }, [onChange, onValueChange, debounceTime, status, hexOrCss, convertToAARRGGBB]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const { startDrag } = useDragHandler();

  const handleSaturationDrag = useCallback((e) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (status === 'pure') {
      setHsv(prev => {
        const newHsv = { h: prev.h, s: x, v: 1 - y };
        if (newHsv.s > 0) {
          lastValidHueRef.current = newHsv.h;
        }
        return newHsv;
      });
    } else {
      updateSelectedStop({
        hsv: { h: gradientStops[selectedStopIndex].hsv.h, s: x, v: 1 - y }
      });
    }
  }, [status, gradientStops, selectedStopIndex, updateSelectedStop]);

  const handleHueDrag = useCallback((e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (status === 'pure') {
      setHsv(prev => ({ ...prev, h: x }));
      lastValidHueRef.current = x;
    } else {
      updateSelectedStop({
        hsv: { ...gradientStops[selectedStopIndex].hsv, h: x }
      });
    }
  }, [status, gradientStops, selectedStopIndex, updateSelectedStop]);

  const handleAlphaDrag = useCallback((e) => {
    if (!alphaRef.current) return;
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (status === 'pure') {
      setAlpha(x);
    } else {
      updateSelectedStop({ alpha: x });
    }
  }, [status, updateSelectedStop]);

  const handleStopDrag = useCallback((index, barRef) => (e) => {
    if (!barRef) return;
    const rect = barRef.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    setGradientStops(prev => {
      const newStops = [...prev];
      newStops[index] = { ...newStops[index], position: x };
      return newStops.sort((a, b) => a.position - b.position);
    });

    setGradientStops(prev => {
      const newIndex = prev.findIndex((_, i) => i === index || (prev[i].position === x && i !== index));
      if (newIndex !== -1) {
        setSelectedStopIndex(newIndex);
      }
      return prev;
    });
  }, []);

  const handleAddStop = useCallback((e) => {
    if (!gradientBarRef.current) return;
    const rect = gradientBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const newStop = {
      position: x,
      hsv: { ...hsv },
      alpha: alpha
    };

    setGradientStops(prev => {
      const newStops = [...prev, newStop];
      return newStops.sort((a, b) => a.position - b.position);
    });

    setGradientStops(prev => {
      const newIndex = prev.findIndex(stop => stop.position === x);
      if (newIndex !== -1) {
        setSelectedStopIndex(newIndex);
      }
      return prev;
    });
  }, [hsv, alpha]);

  const addToRecentPureColors = useCallback((colorItem) => {
    setRecentPureColors(prevColors => {
      const itemStr = JSON.stringify(colorItem);
      const updatedColors = prevColors.filter(c => JSON.stringify(c) !== itemStr);
      updatedColors.unshift(colorItem);
      const limitedColors = updatedColors.slice(0, MAX_RECENT_COLORS);

      saveToStorage('recentPureColors', limitedColors);

      return limitedColors;
    });
  }, []);

  const addToRecentGradientColors = useCallback((colorItem) => {
    setRecentGradientColors(prevColors => {
      const itemStr = JSON.stringify(colorItem);
      const updatedColors = prevColors.filter(c => JSON.stringify(c) !== itemStr);
      updatedColors.unshift(colorItem);
      const limitedColors = updatedColors.slice(0, MAX_RECENT_COLORS);

      saveToStorage('recentGradientColors', limitedColors);

      return limitedColors;
    });
  }, []);

  const updateSelectedStop = useCallback((updates) => {
    if (status === 'gradient') {
      setGradientStops(prev => {
        const newStops = [...prev];
        newStops[selectedStopIndex] = { ...newStops[selectedStopIndex], ...updates };
        return newStops.sort((a, b) => a.position - b.position);
      });
    }
  }, [status, selectedStopIndex]);

  const calculateGradient = useCallback((customAngle = gradientAngle) => {
    const stopsStr = gradientStops.map(stop => {
      const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
      let colorStr;
      if (hexOrCss === 'HEX' && stop.alpha >= 1) {
        colorStr = rgbToHex(rgb.r, rgb.g, rgb.b);
      } else if ((labelRGBA === 'HSLA' || labelRGBA === 'HSBA') && hexOrCss !== 'HEX') {
        const { h, s, l } = hsvToHsl(stop.hsv.h, stop.hsv.s, stop.hsv.v);
        colorStr = `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${parseFloat(stop.alpha.toFixed(2)).toString()})`;
      } else {
        colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseFloat(stop.alpha.toFixed(2)).toString()})`;
      }
      const position = (stop.position * 100).toFixed(0);
      return `${colorStr} ${position}%`;
    }).join(', ');
    return `linear-gradient(${customAngle}deg, ${stopsStr})`;
  }, [gradientStops, gradientAngle, hexOrCss, labelRGBA]);

  const selectRecentColor = useCallback((colorItem) => {
    let type, colorHex, stops, angle;
    if (typeof colorItem === 'string') {
      if (!colorItem.startsWith('#')) {
        return
      }
      type = 'pure';
      colorHex = colorItem;
    } else if (typeof colorItem === 'object' && colorItem.type) {
      type = colorItem.type;
      if (type === 'pure') {
        colorHex = colorItem.color
      } else if (type === 'gradient') {
        stops = colorItem.stops;
        angle = colorItem.angle;
      } else {
        return
      }
    } else {
      return
    }

    setStatus(type);
    if (type === 'pure') {
      const rgba = hexToRgba(colorHex);
      let newHsv = rgbToHsv(rgba.r, rgba.g, rgba.b);

      if (newHsv.s === 0) {
        newHsv.h = lastValidHueRef.current;
      } else {
        lastValidHueRef.current = newHsv.h;
      }

      setHsv(newHsv);
      setAlpha(rgba.a);
      let formattedColor = hexOrCss === 'HEX' ? colorHex : `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
      setColor(formattedColor);
      setInputColor(formattedColor);
      debouncedOnChange(formattedColor, rgba.a);
      const out = (hexOrCss === 'HEX' && formattedColor.startsWith('#')) ? convertToAARRGGBB(formattedColor, rgba.a) : formattedColor;
      lastOutputRef.current = out;
    } else if (type === 'gradient') {
      setGradientAngle(angle || 0);
      setGradientStops(stops || []);
      setSelectedStopIndex(0);
      const stopsToUse = stops || [];
      const angleToUse = angle || 0;
      const stopsStr = stopsToUse.map(stop => {
        const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
        let colorStr;
        if (hexOrCss === 'HEX' && stop.alpha >= 1) {
          colorStr = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else if ((labelRGBA === 'HSLA' || labelRGBA === 'HSBA') && hexOrCss !== 'HEX') {
          const { h, s, l } = hsvToHsl(stop.hsv.h, stop.hsv.s, stop.hsv.v);
          colorStr = `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${stop.alpha})`;
        } else {
          colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stop.alpha})`;
        }
        const position = (stop.position * 100).toFixed(0);
        return `${colorStr} ${position}%`;
      }).join(', ');
      const gradientStr = `linear-gradient(${angleToUse}deg, ${stopsStr})`;
      setColor(gradientStr);
      setInputColor(gradientStr);
      if (stopsToUse.length > 0) {
        const firstStop = stopsToUse[0];
        const rgb = hsvToRgb(firstStop.hsv.h, firstStop.hsv.s, firstStop.hsv.v);
        setCurrentRgb(rgb);
      }
      debouncedOnChange(gradientStr);
      lastOutputRef.current = gradientStr;
    }
  }, [hexOrCss, labelRGBA, debouncedOnChange, convertToAARRGGBB]);

  const fallbackToValidColor = useCallback(() => {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const validHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const validHexWithAlpha = convertToAARRGGBB(validHex, alpha);
    setColor(validHex);
    setInputColor(validHexWithAlpha);
  }, [hsv, alpha, convertToAARRGGBB]);

  useEffect(() => {
    if (status !== 'pure') {
      return
    }
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setCurrentRgb(rgb);
    let formattedColor;
    if (hexOrCss === 'HEX') {
      formattedColor = hex;
    } else {
      if (labelRGBA === 'RGBA') {
        formattedColor = `rgba(${valueRGBA[0]}, ${valueRGBA[1]}, ${valueRGBA[2]}, ${(valueRGBA[3] / 100).toFixed(2)})`;
      } else if (labelRGBA === 'HSLA') {
        formattedColor = `hsla(${valueRGBA[0]}, ${valueRGBA[1]}%, ${valueRGBA[2]}%, ${(valueRGBA[3] / 100).toFixed(2)})`;
      } else if (labelRGBA === 'HSBA') {
        formattedColor = `hsba(${valueRGBA[0]}, ${valueRGBA[1]}%, ${valueRGBA[2]}%, ${(valueRGBA[3] / 100).toFixed(2)})`;
      }
    }

    const nextOutput = (status === 'pure' && hexOrCss === 'HEX' && formattedColor.startsWith('#'))
      ? convertToAARRGGBB(formattedColor, alpha)
      : formattedColor;
    const isSameOutput = nextOutput === lastOutputRef.current;

    setColor(formattedColor);
    setInputColor(prevInputColor => {
      if (prevInputColor === colorRef.current || (prevInputColor.startsWith('#') && prevInputColor.length === 9 && colorRef.current.startsWith('#') && colorRef.current.length === 7 && prevInputColor.slice(0, 7).toLowerCase() === colorRef.current.toLowerCase())) {
        return hexOrCss === 'HEX' ? displayColor : formattedColor;
      }
      return prevInputColor;
    });

    if (!isSameOutput) {
      debouncedOnChange(formattedColor, alpha);
      lastOutputRef.current = nextOutput;
    }
  }, [status, hsv, alpha, hexOrCss, labelRGBA, valueRGBA, debouncedOnChange, convertToAARRGGBB, displayColor]);

  useEffect(() => {
    let rgbaValues;
    if (labelRGBA === 'RGBA') {
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      rgbaValues = [rgb.r, rgb.g, rgb.b, Math.round(alpha * 100)];
    } else if (labelRGBA === 'HSLA') {
      const { h, s, l } = hsvToHsl(hsv.h, hsv.s, hsv.v);
      rgbaValues = [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), Math.round(alpha * 100)];
    } else {
      rgbaValues = [Math.round(hsv.h * 360), Math.round(hsv.s * 100), Math.round(hsv.v * 100), Math.round(alpha * 100)];
    }
    setValueRGBA(rgbaValues);
  }, [hsv, alpha, labelRGBA]);

  useEffect(() => {
    if (status !== 'gradient') {
      return
    }
    if (gradientStops.length === 0) {
      setGradientStops([
        { position: 0, hsv: { ...hsv }, alpha },
        { position: 1, hsv: { ...hsv }, alpha }
      ]);
      setSelectedStopIndex(0);
      return;
    }
    const currentStop = gradientStops[selectedStopIndex] || { hsv, alpha };
    const currentHsv = currentStop.hsv;
    const currentAlpha = currentStop.alpha;
    if (currentHsv.h !== hsv.h || currentHsv.s !== hsv.s || currentHsv.v !== hsv.v) {
      setHsv(currentHsv)
    }
    if (currentAlpha !== alpha) {
      setAlpha(currentAlpha)
    }
    const gradientStr = calculateGradient();

    const isSameOutput = gradientStr === lastOutputRef.current;

    setColor(gradientStr);
    setInputColor(prevInputColor => {
      if (prevInputColor === colorRef.current) {
        return gradientStr;
      }
      return prevInputColor;
    });

    if (!isSameOutput) {
      debouncedOnChange(gradientStr);
      lastOutputRef.current = gradientStr;
    }

    const rgb = hsvToRgb(currentHsv.h, currentHsv.s, currentHsv.v);
    setCurrentRgb(rgb);
  }, [status, gradientStops, selectedStopIndex, gradientAngle, calculateGradient, hsv, alpha, debouncedOnChange]);

  const handleKeyDownRef = useRef(null);

  const keyDownStateRef = useRef({
    status,
    selectedStopIndex,
    gradientStopsLength: gradientStops.length
  });

  useEffect(() => {
    keyDownStateRef.current = {
      status,
      selectedStopIndex,
      gradientStopsLength: gradientStops.length
    };
  }, [status, selectedStopIndex, gradientStops.length]);

  useEffect(() => {
    handleKeyDownRef.current = (e) => {
      const { status, selectedStopIndex, gradientStopsLength } = keyDownStateRef.current;
      if (e.key === 'Delete' && status === 'gradient' && gradientStopsLength > MIN_GRADIENT_STOPS) {
        setGradientStops(prev => prev.filter((_, i) => i !== selectedStopIndex));
        setSelectedStopIndex(Math.max(0, selectedStopIndex - 1));
      }
    };

    document.addEventListener('keydown', handleKeyDownRef.current);

    return () => {
      document.removeEventListener('keydown', handleKeyDownRef.current);
    };
  }, []);

  const parseGradientString = useCallback((gradientStr) => {
    const linearGradientRegex = /^linear-gradient\((\d+)deg, (.+)\)$/;
    const match = gradientStr.match(linearGradientRegex);
    if (!match) {
      return null;
    }

    const angle = parseInt(match[1], 10);
    const stopsStr = match[2];
    const stops = stopsStr.split(',').map(stopStr => {
      const stopMatch = stopStr.trim().match(/^(.+) (\d+)%$/);
      if (!stopMatch) {
        return null;
      }

      const colorStr = stopMatch[1];
      const position = parseInt(stopMatch[2], 10) / 100;

      let rgba;
      if (colorStr.startsWith('#')) {
        rgba = hexToRgba(colorStr);
      } else if (colorStr.startsWith('rgba')) {
        const rgbaMatch = colorStr.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/);
        if (!rgbaMatch) {
          return null;
        }
        rgba = {
          r: parseInt(rgbaMatch[1], 10),
          g: parseInt(rgbaMatch[2], 10),
          b: parseInt(rgbaMatch[3], 10),
          a: parseFloat(rgbaMatch[4])
        };
      } else {
        return null;
      }

      const hsvColor = rgbToHsv(rgba.r, rgba.g, rgba.b);
      return { position, hsv: hsvColor, alpha: rgba.a };
    }).filter(stop => stop !== null);

    if (stops.length < 2) {
      return null;
    }

    return { angle, stops };
  }, []);

  const handleInputChange = useCallback((e) => {
    const newInputColor = e.target.value;
    setInputColor(newInputColor);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!inputColor) {
      return;
    }

    if (inputColor.includes('linear-gradient')) {
      const parsed = parseGradientString(inputColor);
      if (parsed) {
        setStatus('gradient');
        setGradientAngle(parsed.angle);
        setGradientStops(parsed.stops);
        setSelectedStopIndex(0);
        if (parsed.stops.length > 0) {
          const firstStop = parsed.stops[0];
          setHsv(firstStop.hsv);
          setAlpha(firstStop.alpha);
        }
      } else {
        fallbackToValidColor();
      }
    } else {
      if (isValidColor(inputColor)) {
        setStatus('pure');
        selectRecentColor(inputColor);
      } else {
        fallbackToValidColor();
      }
    }
  }, [inputColor, parseGradientString, selectRecentColor, fallbackToValidColor]);

  const handleGradientClick = useCallback((gradientStr) => {
    const parsed = parseGradientString(gradientStr);
    if (parsed) {
      const gradientItem = { type: 'gradient', angle: parsed.angle, stops: parsed.stops };
      addToRecentGradientColors(gradientItem);
      selectRecentColor(gradientItem);
    }
  }, [parseGradientString, selectRecentColor, addToRecentGradientColors]);

  const handlePanelClose = useCallback(() => {
    if (status === 'pure') {
      const colorItem = { type: 'pure', color };
      addToRecentPureColors(colorItem);
    } else if (status === 'gradient') {
      const gradientItem = { type: 'gradient', angle: gradientAngle, stops: gradientStops };
      addToRecentGradientColors(gradientItem);
    }
  }, [status, color, gradientAngle, gradientStops, addToRecentPureColors, addToRecentGradientColors]);

  const content = (
    <div>
      <div className='tt-color-picker-btn'>
        {showStatus ? (
          <Radio.Group className='tt-color-picker-btn-radio' value={status} onChange={(e) => setStatus(e.target.value)}>
            <Radio.Button value='pure'>纯色</Radio.Button>
            <Radio.Button value='gradient'>渐变色</Radio.Button>
          </Radio.Group>
        ) : (
          initialStatus === 'pure' ? (
            <Radio.Group className='tt-color-picker-btn-radio' value='pure' disabled>
              <Radio.Button value='pure' className='single-radio-button'>纯色</Radio.Button>
            </Radio.Group>
          ) : (
            <Radio.Group className='tt-color-picker-btn-radio' value='gradient' disabled>
              <Radio.Button value='gradient' className='single-radio-button'>渐变色</Radio.Button>
            </Radio.Group>
          )
        )}
        <Button className='tt-color-picker-btn-button' type='text' shape='circle' onClick={() => {
          if (status === 'gradient') {
            updateSelectedStop({ hsv: { h: 0, s: 0, v: 1 }, alpha: 1 });
          } else {
            setHsv({ h: 0, s: 0, v: 1 });
            setAlpha(1);
          }
        }}>
          <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M1 31L31 1' stroke='#ff4d4f' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </Button>
      </div>

      <div className='tt-color-picker-panel'>
        {status === 'pure' ? (
          <PureColorPanel
            hsv={hsv}
            alpha={alpha}
            currentRgb={currentRgb}
            handleSaturationDrag={handleSaturationDrag}
            handleHueDrag={handleHueDrag}
            handleAlphaDrag={handleAlphaDrag}
            startDrag={startDrag}
            saturationRef={saturationRef}
            hueRef={hueRef}
            alphaRef={alphaRef}
          />
        ) : (
          <GradientColorPanel
            gradientStops={gradientStops}
            selectedStopIndex={selectedStopIndex}
            gradientAngle={gradientAngle}
            hsv={hsv}
            currentRgb={currentRgb}
            alpha={alpha}
            handleSaturationDrag={handleSaturationDrag}
            handleHueDrag={handleHueDrag}
            handleAlphaDrag={handleAlphaDrag}
            startDrag={startDrag}
            setSelectedStopIndex={setSelectedStopIndex}
            handleStopDrag={handleStopDrag}
            setGradientAngle={setGradientAngle}
            handleAddStop={handleAddStop}
            saturationRef={saturationRef}
            hueRef={hueRef}
            alphaRef={alphaRef}
            gradientBarRef={gradientBarRef}
          />
        )}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ marginTop: '12px' }}>
        <div className='tt-color-picker-recent-colors-title'>最近使用</div>
        {status === 'gradient' ? (
          <div>
            <div className='tt-color-picker-recent-colors-list'>
              {recentGradientColors.map((item, index) => (
                <div
                  key={index}
                  className='tt-color-picker-recent-color-item'
                  style={{
                    background: `linear-gradient(${item.angle}deg, ${item.stops.map(stop => {
                      const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
                      return `rgba(${rgb.r},${rgb.g},${rgb.b},${stop.alpha}) ${stop.position * 100}%`;
                    }).join(', ')})`
                  }}
                  onClick={() => selectRecentColor(item)}
                  title={`linear-gradient(${item.angle || 0}deg, ${(item.stops || []).map(stop => {
                    const rgb = hsvToRgb(stop.hsv.h, stop.hsv.s, stop.hsv.v);
                    return `rgba(${rgb.r},${rgb.g},${rgb.b},${stop.alpha}) ${Math.round(stop.position * 100)}%`;
                  }).join(', ')})`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className='tt-color-picker-recent-colors-list'>
              {recentPureColors.map((item, index) => {
                const colorHex = typeof item === 'string' ? item : item.color;
                return (
                  <div
                    key={index}
                    className='tt-color-picker-recent-color-item'
                    style={{ backgroundColor: colorHex }}
                    onClick={() => selectRecentColor(item)}
                    title={colorHex}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '14px', color: '#223355', marginBottom: '10px' }}>{'通用颜色'}</div>
        {status === 'gradient' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {commonGradients.map((gradientRow, rowIndex) => (
              <div
                key={`gradient-row-${rowIndex}`}
                className='tt-color-picker-common-color-row'
                style={{ marginBottom: rowIndex === 0 ? '12px' : '0' }}
              >
                {gradientRow.map((gradient, index) => (
                  <div
                    key={`gradient-${rowIndex}-${index}`}
                    className='tt-color-picker-common-color-item'
                    style={{ background: gradient }}
                    onClick={() => handleGradientClick(gradient)}
                    title={gradient}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {commonColorRows.map((colorRow, rowIndex) => (
              <div
                key={`color-row-${rowIndex}`}
                className='tt-color-picker-common-color-row'
                style={{ marginBottom: rowIndex === 0 ? '12px' : '0' }}
              >
                {colorRow.map((color, index) => (
                  <div
                    className='tt-color-picker-common-color-item'
                    key={`color-${rowIndex}-${index}`}
                    style={{ backgroundColor: color }}
                    onClick={() => selectRecentColor(color)}
                    title={color}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomLeft"
      onOpenChange={(open) => !open && handlePanelClose()}
    >
      <div className='tt-color-picker-preview-container'>
        {showIcon && <div className='tt-color-picker-prefix'>
          {prefix}
        </div>}
        <div
          className='tt-color-picker-preview'
          style={{ background: status === 'gradient' ? calculateGradient() : `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alpha})` }}
        />
        <div className='tt-color-picker-value'>
          {displayColor}
        </div>
      </div>
    </Popover>
  );
};

ColorPicker.version = componentVersions.ColorPicker;

export { getInitialStatus };

export default ColorPicker;
