import React, { useState } from 'react';
import { Descriptions, Image as AntdImg } from 'antd';
import './detail.less';
import noPicture from '@/images/nopicture.png';

const DItem = Descriptions.Item;

const isEmptyValue = a => {
    return a === null || a === undefined || a === '';
};

export default function Detail({ children, className }) {
    return <div className={`detail-page ${className}`}>{children}</div>;
}

Detail.Item = function DetailItem({ title, Icon, children }) {
    return (
        <div className="detail-item">
            <div className="detail-item__title">
                {Icon && <Icon></Icon>}
                {title}
            </div>
            {children}
        </div>
    );
};

Detail.Table = function DetailTable(props) {

    const { data, columns = [], title, columnNum, bordered = true, children } = props;

    return (
        <Descriptions className="detail-table" bordered={bordered} size="small" column={columnNum || 4} title={title}>
            {columns.map(column => {
                const value = data[column.dataIndex];
                if (column.type === 'image' && value) {
                    return column.split ? (
                        <DItem {...column.itemProps} label={column.title}>
                            {value.split(column.splitText || ',').map(url => (
                                <AntdImg
                                    width={100}
                                    height={100}
                                    src={Image.url(
                                        column.format
                                            ? Object.renderRecord(column.format, {
                                                  record: data,
                                                  value,
                                              })
                                            : url,
                                        true
                                    )}
                                ></AntdImg>
                            ))}
                        </DItem>
                    ) : (
                        <DItem {...column.itemProps} label={column.title}>
                            <AntdImg
                                width={100}
                                height={100}
                                src={Image.url(
                                    column.format
                                        ? Object.renderRecord(column.format, {
                                              record: data,
                                              value,
                                          })
                                        : value,
                                    true
                                )}
                            ></AntdImg>
                        </DItem>
                    );
                }
                if (column.type === 'map') {
                    const target = column.items.find(item => String(item.value) === String(value));
                    const text = column.format
                        ? Object.renderRecord(column.format, {
                              record: data,
                              ...target,
                          })
                        : target?.text;
                    return (
                        <DItem {...column.itemProps} key={column.dataIndex} label={column.title}>
                            {text || '--'}
                        </DItem>
                    );
                }
                if (column.type === 'subtitle') {
                    return Detail.Subtitle({ title: column.title });
                }
                let _value = (column.render
                    ? column.render(value, data)
                    : column.format
                        ? Object.renderRecord(column.format, {
                            record: data,
                            value,
                        })
                        : value);
                return (
                    <DItem
                        {...column.itemProps}
                        key={column.dataIndex}
                        label={
                            column.titleFormat
                                ? `${Object.renderRecord(column.titleFormat, { props })}`
                                : column.title
                        }
                    >
                        { isEmptyValue(_value) ? '--' : _value }
                    </DItem>
                );
            })}
            {children}
        </Descriptions>
    );
};

Detail.Subtitle = function DetailSubtitle({ title }) {
    return <div className="detail-subtitle">{title}</div>;
};

Detail.Images = function DetailImages({ urls, texts = [] }) {
    const [imageData, setImageData] = useState(
        urls.map((url, index) => ({
            id: index,
            url,
            isError: false,
        }))
    );

    const onError = id => {
        imageData[id].isError = true;
        setImageData(imageData.concat());
    };

    return (
        <div className="detail-images">
            {imageData.map(image => (
                <div className="image-block">
                    <img
                        key={image.id}
                        className="detail-picture"
                        src={image.isError ? noPicture : image.url}
                        alt="特征图"
                        onError={onError.bind(this, image.id)}
                    />
                    {texts[image.id] && (
                        <div className="image-block__text">
                            <span>{texts[image.id].left}</span>
                            <span>{texts[image.id].right}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
