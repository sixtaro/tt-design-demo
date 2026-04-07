import React, { useState, useEffect } from 'react';
import { CaretDownOutlined, CaretRightOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip, Pagination } from 'antd';
import Scrollbars from 'react-custom-scrollbars-2';

const Item = props => {
    const { selectedId, switchId, data } = props;
    const { questionID, title, couser, answer } = data;

    const handleClick = () => {
        switchId(questionID === selectedId ? null : questionID);
    };

    const safeText = text => {
        if (!text) {
            return '';
        }
        return text.replace(/</g, '&lgt;').replace(/>/g, '&rgt;');
    };

    return (
        <div className="question-item">
            <div className="item-desc" onClick={handleClick}>
                <span className="item-desc-btn">
                    {questionID === selectedId ? <CaretDownOutlined /> : <CaretRightOutlined />}
                </span>
                <Tooltip title={safeText(title)}>
                    <span className="item-desc-title">{safeText(title)}</span>
                </Tooltip>
                {couser ? (
                    <span className="item-desc-link" onClick={e => e.stopPropagation()}>
                        <a href={couser} target="_blank" rel="noopener noreferrer">
                            <RightOutlined style={{ color: '#b8b8b8' }} />
                        </a>
                    </span>
                ) : (
                    ''
                )}
            </div>
            {questionID === selectedId ? <div className="item-content">{safeText(answer)}</div> : ''}
        </div>
    );
};

// 常见问题
const Questions = props => {
    const { data } = props;
    // 当前操作的问题id
    const [selectedId, setSelectedId] = useState(null);

    // 分页
    const [pagination, setPagenation] = useState(null);

    useEffect(() => {
        const totalPage = Math.ceil(data.length / 6);
        const currentPage = 1;
        const totalData = data;
        const currentData = data.slice(0, 6);
        setPagenation({
            totalData: totalData,
            totalPage: totalPage,
            currentPage: currentPage,
            currentData: currentData,
        });
    }, [data]);

    const handlePageChange = page => {
        const currentPage = page;
        const currentData = data.slice((page - 1) * 6, page * 6);
        setPagenation({
            ...pagination,
            currentPage: currentPage,
            currentData: currentData,
        });
    };

    // 切换操作的问题
    const switchId = id => {
        setSelectedId(id);
    };
    return (
        <>
            <div className="question-list">
                <Scrollbars>
                    {pagination?.currentData?.map(item => {
                        return <Item selectedId={selectedId} switchId={switchId} data={item} key={item.questionID} />;
                    })}
                </Scrollbars>
            </div>
            <Pagination
                className="question-page"
                defaultPageSize={6}
                defaultCurrent={1}
                total={data.length}
                hideOnSinglePage={true}
                size="small"
                onChange={handlePageChange}
            ></Pagination>
        </>
    );
};

export default Questions;
