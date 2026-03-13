/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react';
import { Button, Popover, Space, Select, InputNumber, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import './customPagination.less';

export default function CustomPagination({ config, handlePaginationChange }) {
    const [visible, setVisible] = useState();
    const totalPage = useMemo(() => {
        const result = Math.ceil(config.total / config.pageSize) || 1;

        if (isNaN(result)) {
            return 0;
        }

        return result;
    }, [config.pageSize, config.total]);

    const numPerPage = useMemo(() => {
        return config.pageSizeOptions.map(numStr => {
            return {
                label: numStr + '条',
                value: +numStr,
            };
        });
    }, [config.pageSizeOptions]);

    const onPageSizeChange = value => {
        handlePaginationChange({
            ...config,
            pageSize: value,
        });
        setVisible(false);
    };

    const goPage = pageNum => {
        handlePaginationChange({
            ...config,
            current: pageNum,
        });
        setVisible(false);
    };

    const onJumpChange = e => {
        const jumpPage = Math.floor(+e.target.value);

        if (jumpPage < 1 || jumpPage > totalPage || isNaN(jumpPage)) {
            message.info('请输入正确的页数');
            return;
        }

        goPage(jumpPage);
    };

    const goPrevPage = () => {
        goPage(config.current - 1);
    };

    const goNextPage = () => {
        goPage(config.current + 1);
    };

    const popContent = (
        <div>
            <PageList current={config.current} totalPage={totalPage} onPageClick={goPage}></PageList>
            <div className="pop-row">
                <Select style={{ width: 100 }} value={config.pageSize} onChange={onPageSizeChange} options={numPerPage}></Select>
                <span className="m10">/页</span>
            </div>
            <div className="pop-row">
                <span>跳至</span>
                <InputNumber className="m10" min={1} precision={0} onPressEnter={onJumpChange}></InputNumber>
                <span>页</span>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'inline-block' }} className="custom-pagination">
            <LeftOutlined className={classnames('pagination-icon', { disabled: config.current === 1 || config.current === 0 })} onClick={goPrevPage} />
            <Popover
                overlayClassName="pagination-popover"
                placement="bottom"
                trigger="click"
                content={popContent}
                visible={visible}
                onVisibleChange={setVisible}
            >
                <Button style={{ marginRight: 8, color: 'var(--ant-primary-color)' }}>{config.current || 1}</Button>
            </Popover>
            <span style={{ padding: '0 6px' }}>/</span>
            <span style={{ marginLeft: 13 }}>{totalPage}</span>
            <RightOutlined className={classnames('pagination-icon', { disabled: config.current === totalPage || config.current === 0 })} onClick={goNextPage} />
            <span style={{ marginLeft: 6 }}>共{config.total}行</span>
        </div>
    );
}

function PageList({ current, totalPage, onPageClick }) {
    const pageArr = useMemo(() => {
        const genNumItem = num => ({
            value: num,
            text: `${num}`,
        });

        const prevEllipsis = {
            value: 'prev-ellipsis',
            text: '...',
        };

        const nextEllipsis = {
            value: 'next-ellipsis',
            text: '...',
        };

        let allPage = [];
        for (let i = 0; i < totalPage; i++) {
            allPage.push(genNumItem(i + 1));
        }

        let result = [];

        if (totalPage > 9) {
            result = [allPage[0], allPage[allPage.length - 1]];

            if (current > 5) {
                result.splice(1, 0, prevEllipsis);
            } else {
                result.splice(1, 0, genNumItem(2), genNumItem(3), genNumItem(4), genNumItem(5), genNumItem(6), genNumItem(7));
            }

            if (totalPage - current > 4) {
                result.splice(result.length - 1, 0, nextEllipsis);
            } else {
                result.splice(
                    2,
                    0,
                    genNumItem(totalPage - 6),
                    genNumItem(totalPage - 5),
                    genNumItem(totalPage - 4),
                    genNumItem(totalPage - 3),
                    genNumItem(totalPage - 2),
                    genNumItem(totalPage - 1)
                );
            }

            if (current > 5 && totalPage - current > 4) {
                result.splice(2, 0, genNumItem(current - 2), genNumItem(current - 1), genNumItem(current), genNumItem(current + 1), genNumItem(current + 2));
            }
        } else {
            result = allPage;
        }

        return result;
    }, [current, totalPage]);

    return (
        <div>
            {pageArr.map(pageItem => (
                <div
                    className={classnames('page-num', {
                        current: current === pageItem.value,
                        disabled: current === pageItem.value || pageItem.text === '...',
                    })}
                    key={pageItem.value}
                    onClick={() => onPageClick(pageItem.value)}
                >
                    {pageItem.text}
                </div>
            ))}
        </div>
    );
}
