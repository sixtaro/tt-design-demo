import React from 'react';
import { render, screen } from '@testing-library/react';
import QRCode from './index';

describe('QRCode', () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => []),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    }));
  });

  it('renders canvas qrcode by default', () => {
    const { container } = render(
      <QRCode value="https://tt-design.demo" version={QRCode.version} />
    );

    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('renders svg qrcode when renderAs is svg', () => {
    const { container } = render(
      <QRCode value="https://tt-design.demo/svg" renderAs="svg" version={QRCode.version} />
    );

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('passes title to wrapper', () => {
    render(
      <QRCode value="tt-design" title="测试二维码" version={QRCode.version} />
    );

    expect(screen.getByTitle('测试二维码')).toBeInTheDocument();
  });
});
