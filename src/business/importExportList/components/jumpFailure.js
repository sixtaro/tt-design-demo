import { useEffect, useState } from 'react';
import { Request } from '@/utils';

const JumpFailure = props => {
    const { url, param = {}, onClick = () => {} } = props;

    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await Request(
                {
                    _url: url,
                },
                param
            );
            if (res.success) {
                setHasData(true);
            }
        };
        fetchData();
    }, [url, param]);

    return hasData ? (
        <>
            ，或者下载(
            <a className="download" target="_blank" rel="noreferrer" href={url} onClick={onClick}>
                未导入数据
            </a>
            )
        </>
    ) : (
        ''
    );
};

export default JumpFailure;
