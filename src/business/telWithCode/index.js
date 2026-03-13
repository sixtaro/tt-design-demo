// 带有区号的手机号选择
import { useEffect, useState } from 'react';
import { Input, InputNumber, Select } from 'antd';

export default ({ value, onChange, ...props }) => {
    const [code, setCode] = useState();
    const [number, setNumber] = useState();

    useEffect(() => {
        if (value?.indexOf('852') === 0) {
            setCode('852');
            setNumber(value.substr(3) || '');
        } else if (value?.indexOf('853') === 0) {
            setCode('853');
            setNumber(value.substr(3) || '');
        } else {
            setCode(code => code || '86');
            setNumber(value || '');
        }
    }, [value]);

    const handleChange = (value, type) => {
        const _code = type === 'code' ? value : code;
        const _number = (type === 'code' ? '' : value) || '';
        setCode(_code);
        setNumber(_number);
        if (!_number) {
            onChange?.('');
        } else {
            if (_code === '86') {
                onChange?.(_number);
            } else {
                onChange?.(_code + _number);
            }
        }
    };

    return (
        <>
            <Input.Group compact>
                <Select {...props} style={{ width: 102 }} value={code} onChange={value => handleChange(value, 'code')}>
                    <Select.Option value="86">内地+86</Select.Option>
                    <Select.Option value="852">香港+852</Select.Option>
                    <Select.Option value="853">澳门+853</Select.Option>
                </Select>
                <InputNumber
                    {...props}
                    style={{ width: 'calc(100% - 102px)' }}
                    value={number}
                    precision={0}
                    controls={false}
                    stringMode={true}
                    onChange={value => handleChange(value, 'number')}
                    maxLength={code === '86' ? 11 : 8}
                />
            </Input.Group>
        </>
    );
};
