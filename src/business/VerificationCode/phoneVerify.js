import { useRef } from 'react';
import { Modal, Form, Input, message, Row, Col } from 'antd';
import { CountdownButton } from '../CountdownButton';
import { Utils } from '@/utils';

const { encodeTel } = Utils;

function Verify({ telNo, onOk, onCancel, sendSmsApi, sendSmsParam }) {
  const refForm = useRef();
  const sendCode = sendCodeFunc => {
    sendCodeFunc(sendSmsParam || {});
  };

  const onFinish = values => {
    onOk?.(values);
  };
  return (
    <Modal
      title="手机号验证"
      onOk={() => {
        refForm.current.submit();
      }}
      onCancel={onCancel}
      maskClosable={false}
      open={true}
      width={400}
    >
      <Form onFinish={onFinish} ref={refForm} requiredMark={false}>
        <Form.Item initialValue={encodeTel(telNo)} label="手机号" name="telNo" rules={[{ required: true, message: '请输入手机号码' }]}>
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
              <CountdownButton style={{ width: '100%' }} onSend={sendCode} onError={result => message.error(result.message)} api={sendSmsApi} />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Verify;
