import React from 'react';
import Row from './index';

const { Col } = Row;

const colStyle = {
  background: '#0092ff',
  padding: '8px 0',
  textAlign: 'center',
  color: '#fff',
};

export default {
  title: '布局/Grid 栅格',
  component: Row,
  subcomponents: { Col },
  parameters: {
    docs: {
      description: {
        component: `Grid 栅格组件 - 版本: ${Row.version}`
      }
    }
  },
  argTypes: {
    gutter: {
      control: 'number'
    },
    justify: {
      control: {
        type: 'select',
        options: ['start', 'end', 'center', 'space-around', 'space-between']
      }
    },
    align: {
      control: {
        type: 'select',
        options: ['top', 'middle', 'bottom']
      }
    },
    version: {
      control: 'text'
    }
  }
};

export const Basic = () => (
  <div>
    <Row version={Row.version}>
      <Col span={24}><div style={colStyle}>col-24</div></Col>
    </Row>
    <Row version={Row.version}>
      <Col span={12}><div style={colStyle}>col-12</div></Col>
      <Col span={12}><div style={{ ...colStyle, background: '#00474f' }}>col-12</div></Col>
    </Row>
    <Row version={Row.version}>
      <Col span={8}><div style={colStyle}>col-8</div></Col>
      <Col span={8}><div style={{ ...colStyle, background: '#00474f' }}>col-8</div></Col>
      <Col span={8}><div style={colStyle}>col-8</div></Col>
    </Row>
    <Row version={Row.version}>
      <Col span={6}><div style={colStyle}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, background: '#00474f' }}>col-6</div></Col>
      <Col span={6}><div style={colStyle}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, background: '#00474f' }}>col-6</div></Col>
    </Row>
  </div>
);

export const WithGutter = () => (
  <Row gutter={16} version={Row.version}>
    <Col span={6}><div style={colStyle}>col-6</div></Col>
    <Col span={6}><div style={{ ...colStyle, background: '#00474f' }}>col-6</div></Col>
    <Col span={6}><div style={colStyle}>col-6</div></Col>
    <Col span={6}><div style={{ ...colStyle, background: '#00474f' }}>col-6</div></Col>
  </Row>
);

export const Justify = () => (
  <div>
    <p>start</p>
    <Row justify="start" version={Row.version}>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
      <Col span={4}><div style={{ ...colStyle, background: '#00474f' }}>col-4</div></Col>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
    </Row>
    <p>center</p>
    <Row justify="center" version={Row.version}>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
      <Col span={4}><div style={{ ...colStyle, background: '#00474f' }}>col-4</div></Col>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
    </Row>
    <p>end</p>
    <Row justify="end" version={Row.version}>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
      <Col span={4}><div style={{ ...colStyle, background: '#00474f' }}>col-4</div></Col>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
    </Row>
    <p>space-between</p>
    <Row justify="space-between" version={Row.version}>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
      <Col span={4}><div style={{ ...colStyle, background: '#00474f' }}>col-4</div></Col>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
    </Row>
    <p>space-around</p>
    <Row justify="space-around" version={Row.version}>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
      <Col span={4}><div style={{ ...colStyle, background: '#00474f' }}>col-4</div></Col>
      <Col span={4}><div style={colStyle}>col-4</div></Col>
    </Row>
  </div>
);

export const Align = () => (
  <div style={{ background: 'rgba(128, 128, 128, 0.08)', padding: '8px 0' }}>
    <p>top</p>
    <Row align="top" gutter={16} version={Row.version}>
      <Col span={6}><div style={{ ...colStyle, height: '100px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, background: '#00474f', height: '50px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, height: '120px' }}>col-6</div></Col>
    </Row>
    <p>middle</p>
    <Row align="middle" gutter={16} version={Row.version}>
      <Col span={6}><div style={{ ...colStyle, height: '100px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, background: '#00474f', height: '50px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, height: '120px' }}>col-6</div></Col>
    </Row>
    <p>bottom</p>
    <Row align="bottom" gutter={16} version={Row.version}>
      <Col span={6}><div style={{ ...colStyle, height: '100px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, background: '#00474f', height: '50px' }}>col-6</div></Col>
      <Col span={6}><div style={{ ...colStyle, height: '120px' }}>col-6</div></Col>
    </Row>
  </div>
);

export const Offset = () => (
  <div>
    <Row version={Row.version}>
      <Col span={8}><div style={colStyle}>col-8</div></Col>
      <Col span={8} offset={8}><div style={{ ...colStyle, background: '#00474f' }}>col-8 offset-8</div></Col>
    </Row>
    <Row version={Row.version}>
      <Col span={6} offset={6}><div style={colStyle}>col-6 offset-6</div></Col>
      <Col span={6} offset={6}><div style={{ ...colStyle, background: '#00474f' }}>col-6 offset-6</div></Col>
    </Row>
    <Row version={Row.version}>
      <Col span={12} offset={6}><div style={colStyle}>col-12 offset-6</div></Col>
    </Row>
  </div>
);
