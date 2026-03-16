// 检查是否是渐变颜色
export const isGradientColor = color => {
  return color && typeof color === 'string' && /gradient/i.test(color);
};

// 检查是否是线性渐变
export const isLinearGradient = color => {
  return color && typeof color === 'string' && /linear-gradient/i.test(color);
};

// 检查是否是径向渐变
export const isRadialGradient = color => {
  return color && typeof color === 'string' && /radial-gradient/i.test(color);
};

// 生成唯一的渐变 ID
export const generateGradientId = () => {
  return `gradient-${Math.random().toString(36).substr(2, 9)}`;
};

// 解析线性渐变颜色语法
export const parseLinearGradient = color => {
  const match = color.match(/linear-gradient\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(',').map(p => p.trim());
    let angle = '0deg';
    let colors = [];

    if (parts[0].includes('deg')) {
      angle = parts[0];
      colors = parts.slice(1);
    } else {
      colors = parts;
    }

    return { type: 'linear', angle, colors };
  }
  return null;
};

// 解析径向渐变颜色语法
export const parseRadialGradient = color => {
  const match = color.match(/radial-gradient\(([^)]+)\)/i);
  if (match) {
    const parts = match[1].split(',').map(p => p.trim());
    let shape = 'ellipse';
    let position = 'center';
    let colors = [];

    // 检查是否有形状和位置参数
    if (parts[0].includes('ellipse') || parts[0].includes('circle')) {
      shape = parts[0];
      if (parts[1] && !parts[1].includes('#') && !parts[1].includes('rgb')) {
        position = parts[1];
        colors = parts.slice(2);
      } else {
        colors = parts.slice(1);
      }
    } else {
      colors = parts;
    }

    return { type: 'radial', shape, position, colors };
  }
  return null;
};

// 解析渐变颜色语法
export const parseGradientColor = color => {
  if (isLinearGradient(color)) {
    return parseLinearGradient(color);
  }
  if (isRadialGradient(color)) {
    return parseRadialGradient(color);
  }
  return null;
};

// 渲染线性渐变 SVG 定义
export const renderLinearGradientSvg = (gradientId, gradientData) => {
  if (!gradientId || !gradientData) return null;

  // 根据角度设置线性渐变的方向
  let x1 = '0%',
    y1 = '0%',
    x2 = '100%',
    y2 = '0%';
  const angle = gradientData.angle || '0deg';
  const angleValue = parseInt(angle);

  // 将角度转换为弧度
  const radians = (angleValue * Math.PI) / 180;

  // 计算渐变方向的终点坐标
  // 以中心点为原点，计算角度对应的点
  const centerX = 0.5;
  const centerY = 0.5;
  const radius = 0.5;

  // 计算终点坐标
  const endX = centerX + radius * Math.cos(radians);
  const endY = centerY - radius * Math.sin(radians);

  // 计算起点坐标（终点的对面）
  const startX = centerX - radius * Math.cos(radians);
  const startY = centerY + radius * Math.sin(radians);

  // 转换为百分比
  x1 = `${startX * 100}%`;
  y1 = `${startY * 100}%`;
  x2 = `${endX * 100}%`;
  y2 = `${endY * 100}%`;

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
          {gradientData.colors.map((colorStop, index) => {
            const [color, position] = colorStop.split(' ');
            return <stop key={index} offset={position || `${(index / (gradientData.colors.length - 1)) * 100}%`} stopColor={color} />;
          })}
        </linearGradient>
      </defs>
    </svg>
  );
};

// 渲染径向渐变 SVG 定义
export const renderRadialGradientSvg = (gradientId, gradientData) => {
  if (!gradientId || !gradientData) return null;

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          {gradientData.colors.map((colorStop, index) => {
            const [color, position] = colorStop.split(' ');
            return <stop key={index} offset={position || `${(index / (gradientData.colors.length - 1)) * 100}%`} stopColor={color} />;
          })}
        </radialGradient>
      </defs>
    </svg>
  );
};

// 渲染渐变 SVG 定义
export const renderGradientSvg = (gradientId, gradientData) => {
  if (!gradientId || !gradientData) return null;

  // 根据渐变类型渲染不同的渐变
  if (gradientData.type === 'radial') {
    return renderRadialGradientSvg(gradientId, gradientData);
  } else {
    return renderLinearGradientSvg(gradientId, gradientData);
  }
};
