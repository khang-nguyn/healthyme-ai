import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import Text from "@/components/Text";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearHealthError, selectHealthError } from "../../store/healthSlice";
import type { HealthFormValues } from "../../types/healthReport.type";
import { classNames } from "../../utils/classNames";
import styles from "./FormPage.module.scss";

type FormPageProps = {
  initialValues: Partial<HealthFormValues>;
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
    <Card
      bordered={false}
      className={classNames(styles.content_card, styles.form_content_card)}
    >
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <div>
          <Text type="h3" className={styles.section_title}>
            Let&apos;s build your health snapshot
          </Text>
          <Text
            type="p"
            variant="secondary"
            className={styles.section_subtitle}
          >
            Add a few quick details below and we will generate a clear,
            personalized progress report for you.
          </Text>
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
          className={styles.compact_form}
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <div className={styles.form_flow_grid}>
            <div className={styles.form_flow_cell}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter patient name" />
              </Form.Item>
            </div>
            <div className={styles.form_flow_cell}>
              <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                <InputNumber min={1} max={120} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className={styles.form_flow_cell}>
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
            <div className={styles.form_flow_cell}>
              <Form.Item
                label="Height (cm)"
                name="heightCm"
                rules={[{ required: true }]}
              >
                <InputNumber min={120} max={230} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className={styles.form_flow_cell}>
              <Form.Item
                label="Current Weight (kg)"
                name="currentWeightKg"
                rules={[{ required: true }]}
              >
                <InputNumber min={30} max={250} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className={styles.form_flow_cell}>
              <Form.Item
                label="Goal Weight (kg)"
                name="goalWeightKg"
                rules={[{ required: true }]}
              >
                <InputNumber min={30} max={250} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className={styles.form_flow_cell}>
              <Form.Item
                label="Exercise Time per Day (minutes)"
                name="exerciseMinutesPerDay"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={480} style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className={styles.cta_button}
          >
            Generate Report
          </Button>
        </Form>
      </Space>
    </Card>
  );
}

export default FormPage;
