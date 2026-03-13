import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Utils } from '@/utils';
import { useMemo, useState } from 'react';

const { copyText } = Utils;

export default props => {
    const text = useMemo(() => props.text, [props.text]);
    const [state, setState] = useState();

    return !state ? (
        <CopyOutlined
            className="theme-color"
            onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                const res = copyText(text);
                setState(true);
                props.onDone?.(res);
                setTimeout(() => {
                    setState(false);
                    props.onRestore?.();
                }, props.time || 3000);
            }}
        />
    ) : (
        <CheckOutlined style={{ color: '#52c41a' }} />
    );
};
