import { Layout, Segmented, Space } from "antd";
import { useState } from "react";
import "./App.css";
import Text from "@/components/Text";
import FormPage from "./pages/FormPage";
import ReportPage from "./pages/ReportPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { generateHealthReport, selectHealthLoading } from "./store/healthSlice";
import type { HealthFormValues } from "./types/healthReport.type";

function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectHealthLoading);
  const [activePage, setActivePage] = useState<"form" | "report">("form");

  const initialFormValues: Partial<HealthFormValues> = {};

  const handleGenerateReport = async (values: HealthFormValues) => {
    const result = await dispatch(generateHealthReport(values));

    if (generateHealthReport.fulfilled.match(result)) {
      setActivePage("report");
    }
  };

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header">
        <div className="app_header_grid">
          <div className="app-header-main">
            <Space direction="vertical" size={0}>
              <Text type="span" className="app-kicker">
                Preventive Health Intelligence
              </Text>
              <Text type="h2" className="app-title">
                HealthyMe Care Report
              </Text>
              <Text type="p" className="app-subtitle">
                Clinical-style dashboard for structured patient assessment,
                longitudinal progress tracking, and decision-ready insights.
              </Text>
            </Space>
          </div>
          <div className="switcher-col app_header_switcher">
            <Segmented
              size="large"
              value={activePage}
              onChange={(value) => setActivePage(value as "form" | "report")}
              options={[
                { value: "form", label: "Patient Form" },
                { value: "report", label: "Health Report" },
              ]}
            />
          </div>
        </div>
      </Layout.Header>

      <Layout.Content className="app-content">
        {activePage === "form" ? (
          <FormPage
            initialValues={initialFormValues}
            onGenerateReport={handleGenerateReport}
            loading={loading}
          />
        ) : (
          <ReportPage onBackToForm={() => setActivePage("form")} />
        )}
      </Layout.Content>
    </Layout>
  );
}

export default App;
