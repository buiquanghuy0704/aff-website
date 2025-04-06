import { Form, InputNumber, Modal } from "antd";
import React from "react";
import { ITimerConfig } from "../../interfaces";

interface IConfigModal {
  isModalOpen: boolean;
  timerConfig: ITimerConfig | undefined;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateTimerConfig: (newValue: ITimerConfig) => void;
}

const ConfigModal = (props: IConfigModal) => {
  const { isModalOpen, timerConfig, setIsModalOpen, onUpdateTimerConfig } =
    props;
  const [form] = Form.useForm();
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        pomodoro: timerConfig?.pomodoro,
        shortRest: timerConfig?.shortRest,
        longRest: timerConfig?.longRest,
      });
    }
  }, [timerConfig, isModalOpen]);

  return (
    <Modal
      title="Config your timer"
      open={isModalOpen}
      onOk={() =>
        onUpdateTimerConfig({
          pomodoro: form.getFieldValue("pomodoro"),
          shortRest: form.getFieldValue("shortRest"),
          longRest: form.getFieldValue("longRest"),
        })
      }
      onCancel={handleCancel}
      width={700}
    >
      <Form
        layout={"vertical"}
        form={form}
        initialValues={{ layout: "verical" }}
      >
        <div className="flex items-center justify-between gap-3 mt-4">
          <Form.Item label="Pomodoro" name="pomodoro">
            <InputNumber
              addonAfter="mins"
              placeholder="Enter value"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Short rest" name="shortRest">
            <InputNumber
              addonAfter="mins"
              placeholder="Enter value"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Long rest" name="longRest">
            <InputNumber
              addonAfter="mins"
              placeholder="Enter value"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              className="w-full"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ConfigModal;
