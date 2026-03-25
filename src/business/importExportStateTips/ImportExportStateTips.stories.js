import React from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Font from '@/components/Font';
import ImportExportStateTips from './index';

const ImportExportStateTipsDemo = ({ mode, initialState, title, content, ...args }) => {
  const [state, setState] = React.useState(initialState);

  return (
    <Card style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Font>当前模式：{mode}</Font>
        <Font variant="small" style={{ color: 'var(--tt-text-secondary)' }}>
          点击下方按钮切换通知状态，右下角会弹出对应提示。
        </Font>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="small" onClick={() => setState('pending')}>
            进行中
          </Button>
          <Button size="small" onClick={() => setState('success')}>
            成功
          </Button>
          <Button size="small" onClick={() => setState('error')}>
            失败
          </Button>
          <Button size="small" onClick={() => setState('cancel')}>
            取消
          </Button>
        </div>
        <Font variant="small">当前状态：{state}</Font>
        <ImportExportStateTips {...args} mode={mode} state={state} title={title} content={content} />
      </div>
    </Card>
  );
};

export default {
  title: '业务组件/ImportExportStateTips 导入导出提示',
  component: ImportExportStateTips,
  parameters: {
    docs: {
      description: {
        component: '演示 ImportExportStateTips 在导入和导出场景下的通知提示。',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['import', 'export'],
    },
    initialState: {
      control: false,
    },
  },
};

export const 导入流程 = args => <ImportExportStateTipsDemo {...args} />;
导入流程.args = {
  mode: 'import',
  initialState: 'pending',
  title: '正在导入车主数据',
  content: '导入结束后会继续在右下角通知您。',
};

export const 导出流程 = args => <ImportExportStateTipsDemo {...args} />;
导出流程.args = {
  mode: 'export',
  initialState: 'success',
  title: '导出文件准备完成',
  content: '文件已生成，可前往下载中心查看。',
};
