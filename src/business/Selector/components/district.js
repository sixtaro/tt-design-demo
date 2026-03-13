import { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { Request } from '@/utils';

export default ({ value, onChange, placeholder, style, disabled, districtProps }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchDistrictList = async () => {
            const result = await Request(districtProps?.optionsApi);

            if (result.success) {
                let o = result[districtProps?.resultField] || result.data?.[districtProps?.resultField] || [];
                const transData = data => {
                    return data.map(item => {
                        if (item.children?.length > 0) {
                            transData(item.children);
                        } else {
                            item.children = undefined;
                        }
                        return item;
                    });
                };
                const options = transData(o);
                setOptions(options || []);
            }
        };

        fetchDistrictList();
    }, [districtProps]);

    return (
        <Cascader
            changeOnSelect
            style={style}
            placeholder={placeholder}
            options={options}
            value={value}
            onChange={(value, selectedOptions) =>
                onChange(
                    value,
                    selectedOptions.map(item => ({ label: item.label, value: item.value }))
                )
            }
            disabled={disabled}
        ></Cascader>
    );
};
