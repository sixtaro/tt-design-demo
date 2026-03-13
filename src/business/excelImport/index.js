/* eslint-disable no-unused-vars */
import { Button, message, Modal, Popconfirm, Space, Steps, Tooltip } from 'antd';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Request, Storage } from '@/utils';
import StepOne from './components/stepOne';
import StepThree from './components/stepThree';
import StepTwo from './components/stepTwo';
import './style/index.less';
import { abortPromise, getParamsString, getState, UUID } from './utils';
import { CANCEL_TEXT } from './config';
import * as XLSX from 'xlsx/xlsx.mjs';
import moment from 'moment';

const { Step } = Steps;

const ExcelImport = forwardRef((props, ref) => {
    const { title, modelId, visible, setVisible, onCancel, onOk, importParams, setStatus, status, uploadToken, fileSizeLimit, textPre = false } = props;
    // textPre --- 第二步表格中的文本是否保留空格
    const [current, setCurrent] = useState(0);
    const [config, setConfig] = useState(null);
    // 上传文件状态
    const [uploadStatus, setUploadStatus] = useState();
    // 上传文件
    const [file, setFile] = useState(null);
    // 上传文件excel路径
    const [filePath, setFilePath] = useState('');
    // 文件数据列表
    const [sheets, setSheets] = useState([]);
    // 文件sheets名称
    const [sheetNames, setSheetNames] = useState([]);
    // 选择的文件sheet索引
    const [sheetIndex, setSheetIndex] = useState(0);
    // 数据起始行
    const [dataRowNum, setDataRowNum] = useState(0);
    // 总导入行数
    const [totalCount, setTotalCount] = useState(0);
    // 模板modelKey
    const [modelKey, setModelKey] = useState('');
    // 建立映射时的excel字段
    const [displayNames, setDisplayNames] = useState([]);
    // 导入字段映射
    const [fieldMapper, setFieldMapper] = useState(Storage.get(`export_fieldMapper_${modelId}`) || []);
    // // 导入tips状态控制(初始是等待唤醒的状态)
    // const [status, setStatus] = useState('wait');
    // 导入tips内容配置
    // const [importProcess, window.excelImport?.setImportProcess?.] = useState({});
    // 错误报告内容
    const [simpleText, setSimpleText] = useState('');
    const [remark, setRemark] = useState('');
    const [jobID, setJobID] = useState();
    // 错误报告展示
    const [errorShow, setErrorShow] = useState(false);

    // 定时器轮训导入任务
    const timer = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const res = await Request(
                {
                    _url: '../PublicV2/home/importModel/find',
                    _type: 'get',
                },
                {
                    modelId,
                }
            );
            if (res.success) {
                const data = {
                    ...(res.data || {}),
                    itemDtos: res.data?.items || [],
                };
                setConfig(data);
                setModelKey(data.modelKey);
            } else {
                message.error(res.message || '获取导入模板配置失败');
                setConfig(null);
            }
        };
        if (modelId != null && visible) {
            fetchData();
            window.excelImport?.setImportProcess?.({});
            setFieldMapper(Storage.get(`export_fieldMapper_${modelId}`) || []);
        }
    }, [modelId, visible, setStatus]);

    const handleCancel = async () => {
        if (file?.response?.data?.filePath) {
            const res = await Request(
                {
                    _url: '../PublicV2/home/delimportfile',
                    _type: 'get',
                },
                {
                    filePath: file?.response?.data?.filePath,
                }
            );
            if (res.success) {
                message.success('上传文件取消成功');
            } else {
                message.error(res.message || '上传文件取消失败');
            }
        } else {
            window.cancelUpload?.();
        }
        setCurrent(0);
        setConfig(null);
        setFile(null);
        setFilePath('');
        setUploadStatus('removed');
        setModelKey('');
        setSheets([]);
        setSheetNames([]);
        setSheetIndex(0);
        setDataRowNum(0);
        setTotalCount(0);
        setDisplayNames([]);
        typeof onCancel === 'function' && onCancel();
    };

    // 轮询设置导入提示信息
    const getImportProcess = useCallback(async jobID => {
        const fetchData = async () => {
            try {
                const res = await Request(
                    {
                        _url: '../PublicV2/home/importprocess',
                        _type: 'get',
                    },
                    {
                        jobID,
                    }
                );
                if (res.success) {
                    const status = getState(res.data?.status, res.data?.failType);
                    setStatus(status);
                    window.excelImport?.setImportProcess?.(res.data || {});
                    if (status !== 'pending') {
                        clearInterval(timer.current);
                        const t = setTimeout(() => {
                            typeof onOk === 'function' && onOk(jobID);
                            clearTimeout(t);
                        }, 1000);
                    }
                } else {
                    setStatus('error');
                    window.excelImport?.setImportProcess?.({ status: 3, failType: 9, message: '可能是网络原因，请重试！' });
                }
            } catch (error) {
                setStatus('error');
                window.excelImport?.setImportProcess?.({ status: 3, failType: 9, message: '可能是网络原因，请重试！' });
            }
        };
        if (timer.current) {
            clearInterval(timer.current);
        }
        fetchData();
        timer.current = setInterval(() => {
            fetchData();
        }, 1000);
        // eslint-disable-next-line
    }, []);

    const steps = [
        {
            title: '上传文件',
            content: (
                <StepOne
                    onStatusChange={setUploadStatus}
                    file={file}
                    setFile={setFile}
                    modelId={modelId}
                    setSheets={setSheets}
                    setSheetNames={setSheetNames}
                    setFilePath={setFilePath}
                    uploadToken={uploadToken}
                    fileSizeLimit={fileSizeLimit}
                />
            ),
        },
        {
            title: '选择内容',
            content: (
                <StepTwo
                    sheets={sheets}
                    sheetNames={sheetNames}
                    setSheetIndex={setSheetIndex}
                    setDataRowNum={setDataRowNum}
                    setTotalCount={setTotalCount}
                    setDisplayNames={setDisplayNames}
                    sheetIndex={sheetIndex}
                    dataRowNum={dataRowNum}
                    textPre={textPre}
                />
            ),
        },
        {
            title: '建立映射',
            content: (
                <StepThree
                    modelId={modelId}
                    mapList={config?.itemDtos || []}
                    displayNames={displayNames}
                    fieldMapper={fieldMapper}
                    setFieldMapper={setFieldMapper}
                />
            ),
        },
    ];
    const Footer = useMemo(() => {
        const handleOk = async () => {
            // 必填字段需要校验是否宇excel列关联
            for (let i = 0; i < fieldMapper.length; i++) {
                const curItem = config?.itemDtos?.filter(map => map.itemName === fieldMapper[i].name)[0];
                const isNecessary = curItem?.isNecessary;
                // const isNecessary = mockMapList?.filter(map => map.itemName === fieldMapper[i].name)[0]?.isNecessary;
                if (+isNecessary === 1 && !fieldMapper[i].displayName) {
                    message.error(`必填字段${curItem?.viewName || ''}未配置映射`);
                    return;
                }
            }
            // 验证通过开始执行导入
            const res = await Request(
                {
                    _url: '../PublicV2/home/submitimportjob',
                    _type: 'post',
                },
                {
                    filePath: file?.response?.data?.filePath,
                    modelKey,
                    sheetIndex,
                    dataRowNum,
                    fieldMapper: JSON.stringify(fieldMapper?.filter(field => !!field.displayName) || []),
                    totalCount,
                    requestParam: getParamsString(importParams || {}),
                    orginFileName: file?.name || '',
                }
            );
            if (res.success) {
                const jobID = res.data?.jobID;
                await getImportProcess(jobID);
                setCurrent(0);
                setConfig(null);
                setFile(null);
                setFilePath('');
                setModelKey('');
                setSheets([]);
                setSheetNames([]);
                setSheetIndex(0);
                setDataRowNum(0);
                setTotalCount(0);
                setDisplayNames([]);
                Storage.set(`export_fieldMapper_${modelId}`, fieldMapper);
                // typeof onOk === 'function' && onOk(jobID);
                setVisible(false);
            } else {
                message.error(res.message || '导入失败');
                setStatus('error');
                window.excelImport?.setImportProcess?.({});
            }
        };
        const onBack = () => {
            if (current - 1 === 0) {
                setSheets([]);
                setSheetIndex(0);
                setSheetNames([]);
            }
            setCurrent(current - 1);
            setFieldMapper(Storage.get(`export_fieldMapper_${modelId}`) || []);
        };
        const onNext = () => {
            setCurrent(current + 1);
        };
        const onStepOneNext = () => {
            const reader = new FileReader();
            reader.onload = evt => {
                try {
                    const data = evt.target.result;
                    const workbook = XLSX.read(data, {
                        type: 'binary',
                        sheetRows: 11,
                        cellDates: 'd',
                    }); // 以二进制流方式读取得到整份excel表格对象
                    for (let j = 0; j < workbook.SheetNames.length; j++) {
                        for (const i in workbook.Sheets[workbook.SheetNames[j]]) {
                            if (workbook.Sheets[workbook.SheetNames[j]][i]['v'] != null && workbook.Sheets[workbook.SheetNames[j]][i]['t'] === 'd') {
                                workbook.Sheets[workbook.SheetNames[j]][i]['v'] = moment(new Date(workbook.Sheets[workbook.SheetNames[j]][i]['w'])).format(
                                    'YYYY-MM-DD HH:mm:ss'
                                );
                            }
                        }
                    }
                    let sheets = []; // 存储获取到的数据
                    const totals = [];
                    // 遍历每张表读取
                    for (var sheet in workbook.Sheets) {
                        const arr = [];
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            // 表格的表格范围，可用于判断表头数量是否正确
                            const fromTo = workbook.Sheets[sheet]['!fullref'] || workbook.Sheets[sheet]['!ref'];
                            const total = +fromTo?.split?.(':')?.[1]?.match?.(/\d+/);
                            totals.push(total || 0);
                            sheets.push(
                                XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
                                    range: 0,
                                    header: 1,
                                    defVal: '~',
                                    blankrows: true,
                                })
                            );
                        }
                    }
                    sheets = sheets.map((sheet, index) => {
                        sheet.total = totals[index];
                        return sheet;
                    });
                    setSheets(sheets);
                    setSheetNames(workbook?.SheetNames || []);
                } catch (e) {
                    console.log('文件类型不正确');
                    return;
                }
            };
            reader.onerror = err => {
                console.log(err);
            };
            reader.readAsBinaryString(file?.originFileObj);
            onNext();
        };
        switch (current) {
            case 0:
                return (
                    <Space size={8}>
                        {file ? (
                            <Popconfirm onConfirm={handleCancel} title={CANCEL_TEXT}>
                                <Button>取消</Button>
                            </Popconfirm>
                        ) : (
                            <Button onClick={handleCancel}>取消</Button>
                        )}
                        <Popconfirm
                            title="如果修改了上传的原始文件，请重新上传，否则下一步会解析异常！"
                            onConfirm={onStepOneNext}
                            disabled={!file?.response?.success || !modelKey}
                        >
                            <Button type="primary" disabled={!file?.response?.success || !modelKey}>
                                下一步
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            case 1:
                return (
                    <Space style={{ marginTop: '7px' }} size={8}>
                        <Button onClick={onBack}>上一步</Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                const labels = displayNames.map(item => item.label);
                                if (labels.length !== Array.from(new Set(labels)).length) {
                                    message.warning('表头不允许存在相同名称！');
                                    return;
                                }
                                onNext();
                            }}
                            disabled={!displayNames.length}
                        >
                            下一步
                        </Button>
                    </Space>
                );
            case 2:
                return (
                    <Space size={8}>
                        <span className="total-tips">
                            <span className="text">预计可能导入{totalCount || 0}条数据</span>
                            <Tooltip title="上传文件中，某些行包含空格或进行过拖拽拉伸操作修改样式，可能导致读出的行数不准确，具体以导入结果为准">
                                {' '}
                                {/* <span className="icon"></span> */}
                                <span className="question">
                                    <QuestionCircleOutlined />
                                </span>
                            </Tooltip>
                        </span>
                        <Button onClick={onBack}>上一步</Button>
                        <Button type="primary" onClick={handleOk}>
                            开始导入
                        </Button>
                    </Space>
                );
            default:
                break;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, uploadStatus, displayNames, fieldMapper, filePath, modelKey, sheetIndex, dataRowNum, importParams, totalCount, file]);
    return (
        <>
            <Modal
                title={title || '导入数据'}
                wrapClassName="excel-import-modal"
                visible={visible}
                width={860}
                footer={Footer}
                // onCancel={handleCancel}
                maskClosable={false}
                closeIcon={
                    file ? (
                        <Popconfirm onConfirm={handleCancel} title={CANCEL_TEXT}>
                            <CloseOutlined />
                        </Popconfirm>
                    ) : (
                        <CloseOutlined onClick={handleCancel} />
                    )
                }
            >
                <div className="import-core">
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                </div>
            </Modal>
        </>
    );
});

export default ExcelImport;
