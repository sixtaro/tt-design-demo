import React, { useState } from 'react';
import { TimePicker } from '../../index';

export default {
  title: '数据录入/TimePicker 时间选择器',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 TimePicker 时间选择组件，版本：${TimePicker.version}`
      }
    }
  },
  argTypes: {
    placeholder: { control: 'text', description: '占位文本' },
    disabled: { control: 'boolean', description: '是否禁用' },
    format: { control: 'text', description: '时间格式' },
    use12Hours: { control: 'boolean', description: '是否使用12小时制' },
  }
};

export const 基础用法 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>默认状态</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>自定义格式 HH:mm:ss</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            format="HH:mm:ss"
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>自定义格式 HH:mm</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            format="HH:mm"
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>12小时制</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            use12Hours
            version={TimePicker.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 时间范围选择 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 360 }}>
          <h4>默认范围选择</h4>
          <TimePicker.RangePicker
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>HH:mm 格式</h4>
          <TimePicker.RangePicker
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            format="HH:mm"
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>HH:mm:ss 格式</h4>
          <TimePicker.RangePicker
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            format="HH:mm:ss"
            version={TimePicker.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 状态与尺寸 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>禁用状态</h4>
          <TimePicker
            disabled
            placeholder="禁用状态"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>错误状态</h4>
          <TimePicker
            status="error"
            placeholder="错误状态"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>只读状态</h4>
          <TimePicker
            allowClear={false}
            placeholder="只读状态"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 360 }}>
          <h4>范围禁用</h4>
          <TimePicker.RangePicker
            disabled
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>范围错误状态</h4>
          <TimePicker.RangePicker
            status="error"
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            version={TimePicker.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 时间步长 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>小时步长 2</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            hourStep={2}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>分钟步长 15</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            minuteStep={15}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>秒步长 10</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            secondStep={10}
            version={TimePicker.version}
          />
        </div>
        <div style={{ minWidth: 260 }}>
          <h4>小时/分钟/秒步长组合</h4>
          <TimePicker
            placeholder="请选择时间"
            style={{ width: 260 }}
            hourStep={2}
            minuteStep={30}
            secondStep={30}
            version={TimePicker.version}
          />
        </div>
      </div>
    </div>
  );
};

export const 受控组件 = () => {
  const [time, setTime] = useState(null);
  const [rangeTime, setRangeTime] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <h4>单个时间受控</h4>
          <TimePicker
            value={time}
            onChange={setTime}
            placeholder="请选择时间"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
            当前值：{time ? time.format('HH:mm:ss') : '未选择'}
          </div>
        </div>
        <div style={{ minWidth: 360 }}>
          <h4>范围时间受控</h4>
          <TimePicker.RangePicker
            value={rangeTime}
            onChange={setRangeTime}
            placeholder={['开始时间', '结束时间']}
            style={{ width: 360 }}
            version={TimePicker.version}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
            当前值：
            {rangeTime
              ? `${rangeTime[0]?.format('HH:mm:ss')} - ${rangeTime[1]?.format('HH:mm:ss')}`
              : '未选择'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const 样式预览 = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h4>单个时间选择器下拉面板</h4>
        <div style={{ paddingBottom: '380px' }}>
          <TimePicker
            open={true}
            placeholder="请选择时间"
            style={{ width: 260 }}
            version={TimePicker.version}
          />
        </div>
      </div>
      <div>
        <h4>时间范围选择器下拉面板</h4>
        <div style={{ paddingBottom: '380px' }}>
          <TimePicker.RangePicker
            open={true}
            placeholder={['开始时间', '结束时间']}
            style={{ width: 500 }}
            version={TimePicker.version}
          />
        </div>
      </div>
    </div>
  );
};
