/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Input, Spin, message } from 'antd';
import { CustomerServiceOutlined, CloseOutlined } from '@ant-design/icons';
import Questions from './questions';
import { request, Storage } from '@/utils';
import serviceImg from '../img/service.png';

let timer = null;
const Content = props => {
    const { open, setOpen, rightID } = props;
    const helpCenterConfig = Storage.get('helpCenterConfig') || {};
    const { onlineService } = helpCenterConfig;

    // 搜索值
    const [searchName, setSearchName] = useState('');
    // 常见问题
    const [question, setQuestion] = useState([]);
    // 加载中
    const [spin, setSpin] = useState(false);

    const handleClick = () => {
        setOpen(false);
    };

    const handleChange = value => {
        const searchName = value;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            setSearchName(searchName);
        }, 400);
    };

    const fetchData = async param => {
        setSpin(true);
        const res = await request('../PublicV2/home/helpcenter/questions', {
            ...param,
        });
        if (res.success) {
            const temp = res.data?.list || [];
            setQuestion(temp);
        } else {
            // message.error(res.message || '获取帮助中心数据异常');
        }
        setSpin(false);
    };

    useEffect(() => {
        fetchData({
            rightID: rightID,
            searchText: searchName,
        });
    }, [rightID, searchName]);

    const onServiceClick = () => {
        window.open('https://cschat.antcloud.com.cn/index.htm?tntInstId=hSa_xpiX&scene=SCE00180906#/');
    };

    const serviceIcon = () => {
        return <img src={serviceImg} alt="" style={{
            width: '16px',
            height: '18px',
            marginRight: '5px',
            paddingBottom: '3px',
        }}></img>;
    };

    return open ? (
        <div className="window-wrap">
            <div className="window-container">
                <div className="window-title">
                    <span className="title-text">帮助中心</span>
                    <span className="title-close" onClick={handleClick}>
                        <CloseOutlined style={{ color: '#9f9f9f' }} />
                    </span>
                </div>
                {/* <div className="window-search">
                    <Input
                        className="search-input"
                        onChange={handleChange}
                        placeholder="输入功能与帮助"
                        allowClear
                        suffix={<span className="search-icon"></span>}
                    />
                </div> */}
                <div className="window-search">
                    <Input.Search
                        enterButton="搜索"
                        allowClear
                        size="large"
                        placeholder="请输入您想要查找的内容"
                        onSearch={handleChange}
                        suffix={<span className="search-icon"></span>}
                        maxLength={30}
                    ></Input.Search>
                </div>
                <Spin spinning={spin}>
                    <div className="window-questions">
                        <div className="question-title">
                            <div className="title-line"></div>
                            <div className="title-label">常见问题</div>
                        </div>
                        {question.length ? (
                            <Questions data={question} />
                        ) : (
                            <div className="no-data">
                                <div className="no-data-icon"></div>
                                <div className="no-data-text">'抱歉，暂时无相关常见问题哦～'</div>
                            </div>
                        )}
                    </div>
                </Spin>
                {onlineService && (
                    <div className="online-service">
                        <Button icon={serviceIcon()} onClick={onServiceClick}>
                            在线客服
                        </Button>
                    </div>
                )}
            </div>
        </div>
    ) : (
        ''
    );
};

export default Content;
