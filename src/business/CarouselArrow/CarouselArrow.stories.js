import CarouselArrow from './index';

export default {
  title: '业务组件/CarouselArrow 轮播箭头',
  component: CarouselArrow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `CarouselArrow 组件 - 版本: ${CarouselArrow.version}`,
      },
    },
  },
  argTypes: {
    slidesToShow: {
      control: {
        type: 'number',
        min: 1,
        max: 10,
      },
    },
    version: {
      control: false,
    },
    children: {
      control: false,
    },
  },
};

const Template = args => <CarouselArrow {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  version: CarouselArrow.version,
  slidesToShow: 1,
  children: (
    <>
      <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>幻灯片 1</div>
      <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>幻灯片 2</div>
      <div style={{ background: '#FF7D00', color: 'white', padding: '40px', textAlign: 'center' }}>幻灯片 3</div>
      <div style={{ background: '#F7BA1E', color: 'white', padding: '40px', textAlign: 'center' }}>幻灯片 4</div>
    </>
  ),
};

export const 多幻灯片 = () => (
  <div style={{ padding: '24px' }}>
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>单张幻灯片</h4>
      <CarouselArrow version={CarouselArrow.version} slidesToShow={1}>
        <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>1</div>
        <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>2</div>
        <div style={{ background: '#FF7D00', color: 'white', padding: '40px', textAlign: 'center' }}>3</div>
        <div style={{ background: '#F7BA1E', color: 'white', padding: '40px', textAlign: 'center' }}>4</div>
        <div style={{ background: '#722ED1', color: 'white', padding: '40px', textAlign: 'center' }}>5</div>
      </CarouselArrow>
    </div>
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>两张幻灯片</h4>
      <CarouselArrow version={CarouselArrow.version} slidesToShow={2}>
        <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>1</div>
        <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>2</div>
        <div style={{ background: '#FF7D00', color: 'white', padding: '40px', textAlign: 'center' }}>3</div>
        <div style={{ background: '#F7BA1E', color: 'white', padding: '40px', textAlign: 'center' }}>4</div>
        <div style={{ background: '#722ED1', color: 'white', padding: '40px', textAlign: 'center' }}>5</div>
      </CarouselArrow>
    </div>
    <div>
      <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>三张幻灯片</h4>
      <CarouselArrow version={CarouselArrow.version} slidesToShow={3}>
        <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>1</div>
        <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>2</div>
        <div style={{ background: '#FF7D00', color: 'white', padding: '40px', textAlign: 'center' }}>3</div>
        <div style={{ background: '#F7BA1E', color: 'white', padding: '40px', textAlign: 'center' }}>4</div>
        <div style={{ background: '#722ED1', color: 'white', padding: '40px', textAlign: 'center' }}>5</div>
      </CarouselArrow>
    </div>
  </div>
);

export const 内容不足 = () => (
  <div style={{ padding: '24px' }}>
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>幻灯片数量等于显示数量 (不显示箭头)</h4>
      <CarouselArrow version={CarouselArrow.version} slidesToShow={2}>
        <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>1</div>
        <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>2</div>
      </CarouselArrow>
    </div>
    <div>
      <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>幻灯片数量少于显示数量 (不显示箭头)</h4>
      <CarouselArrow version={CarouselArrow.version} slidesToShow={3}>
        <div style={{ background: '#165DFF', color: 'white', padding: '40px', textAlign: 'center' }}>1</div>
        <div style={{ background: '#0FC6C2', color: 'white', padding: '40px', textAlign: 'center' }}>2</div>
      </CarouselArrow>
    </div>
  </div>
);

export const 自定义内容 = () => (
  <div style={{ padding: '24px' }}>
    <h4 style={{ marginBottom: '16px', color: 'var(--tt-text-title)' }}>图片轮播</h4>
    <CarouselArrow version={CarouselArrow.version} slidesToShow={2}>
      <div style={{ background: '#E8F3FF', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</div>
        <div>图片 1</div>
      </div>
      <div style={{ background: '#E8FFEA', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
        <div>图片 2</div>
      </div>
      <div style={{ background: '#FFF7E8', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
        <div>图片 3</div>
      </div>
    </CarouselArrow>
  </div>
);
