import { useMemo, useRef } from 'react';
import { Modal, Form, Input, message, Row, Col } from 'antd';
import { CountdownButton } from '@/business';
import { Request, Utils } from '@/utils';
import moment from 'moment';
import md5 from 'md5';

const { encodeTel } = Utils;

const getMsgSign = (telNo, type, codeSendType, randomString) => {
    let msgSing = '';
    var telNoStr = 'telNO=' + telNo + '&';
    var typeStr = 'functionType=' + type + '&';
    var codeSendTypeStr = 'codeSendType=' + codeSendType + '&';
    var randomStringStr = 'randomString=' + randomString + '&';
    var array = [];
    array[0] = telNoStr;
    array[1] = randomStringStr;
    array[2] = typeStr;
    array[3] = codeSendTypeStr;
    array.sort();
    for (var i = 0; i < array.length; i++) {
        msgSing += array[i];
    }
    msgSing += 'key=TongTongV32017';
    return msgSing;
};

const Verify = props => {
    const refForm = useRef();
    const telNo = useMemo(() => props.user.userGroup.userGroupManagerTel, [props.user.userGroup.userGroupManagerTel]);
    const verifyIdentify = async identifyCode => {
        const param = {
            telNo,
            identifyCode: md5(identifyCode),
        };
        const result = await Request(props.api.home?.group?.cashier?.verifyidentify || { _url: '../PublicV2/home/group/cashier/verifyidentify', _type: 'POST' }, param);
        if (result.success) {
            props.user.verify = true;
            props.saveUser?.(props.user);
            props.onOk();
        } else {
            message.error(result.message);
        }
    };
    const sendCode = sendCodeFunc => {
        const randomString = moment().format('yyyy-MM-DD HH:mm:ss');
        const sign = md5(getMsgSign(telNo, 5, 0, randomString));
        const param = {
            telNo,
            type: 5,
            codeSendType: 0,
            randomString,
            sign,
        };
        sendCodeFunc(param);
    };

    const onFinish = values => {
        verifyIdentify(values.identifyCode);
    };
    return (
        <Modal
            title="身份核验"
            onOk={() => {
                refForm.current.submit();
            }}
            onCancel={props.onCancel}
            maskClosable={false}
            visible={true}
            width={400}
        >
            <Form onFinish={onFinish} ref={refForm} requiredMark={false}>
                <Form.Item
                    initialValue={encodeTel(telNo)}
                    label="手机号"
                    name="telNo"
                    rules={[{ required: true, message: '请输入手机号码' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="验证码">
                    <Row>
                        <Col span={13}>
                            <Form.Item name="identifyCode" rules={[{ required: true, message: '请输入短信验证码' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10} offset={1}>
                            <CountdownButton
                                style={{ width: '100%' }}
                                onSend={sendCode}
                                onError={result => message.error(result.message)}
                                api={props.api.home?.group?.cashier?.sendsmscode || { _url: '../PublicV2/home/group/cashier/sendsmscode', _type: 'post' }}
                            />
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Verify;
