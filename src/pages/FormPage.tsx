import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
} from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearHealthError, selectHealthError } from "../store/healthSlice";
import type { HealthFormValues } from "../types/healthReport";

type FormPageProps = {
  initialValues: HealthFormValues;
  onGenerateReport: (values: HealthFormValues) => Promise<void>;
  loading: boolean;
};

function FormPage({ initialValues, onGenerateReport, loading }: FormPageProps) {
  const [form] = Form.useForm<HealthFormValues>();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectHealthError);

  const handleFinish = async (values: HealthFormValues) => {
    dispatch(clearHealthError());
    await onGenerateReport(values);
  };

  return (
    <Card bordered={false} className="content-card">
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Typography.Title level={3} className="section-title">
            Patient Input Form
          </Typography.Title>
          <Typography.Text type="secondary" className="section-subtitle">
            Fill in profile data to generate a mock health care report.
          </Typography.Text>
        </div>

        {error ? (
          <Alert
            type="error"
            showIcon
            closable
            message="Cannot generate report"
            description={error}
            onClose={() => dispatch(clearHealthError())}
          />
        ) : null}

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <div className="form_grid_3">
            <div className="span_6">
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter patient name" />
              </Form.Item>
            </div>
            <div className="span_3">
              <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                <InputNumber min={1} max={120} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="span_3">
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          <div className="form_grid_2">
            <div className="span_6">
              <Form.Item
                label="Height (cm)"
                name="heightCm"
                rules={[{ required: true }]}
              >
                <InputNumber min={120} max={230} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="span_6">
              <Form.Item
                label="Current Weight (kg)"
                name="currentWeightKg"
                rules={[{ required: true }]}
              >
                <InputNumber min={30} max={250} style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <div className="form_grid_2">
            <div className="span_6">
              <Form.Item
                label="Goal Weight (kg)"
                name="goalWeightKg"
                rules={[{ required: true }]}
              >
                <InputNumber min={30} max={250} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="span_6">
              <Form.Item
                label="Exercise Time per Day (minutes)"
                name="exerciseMinutesPerDay"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={480} style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Goal" name="goal" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe target outcome" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="cta-button"
          >
            Generate Report
          </Button>
        </Form>
      </Space>
    </Card>
  );
}

export default FormPage;
