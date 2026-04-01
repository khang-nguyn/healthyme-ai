import { Layout, Segmented, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import "./App.css";
import FormPage from "./pages/FormPage";
import ReportPage from "./pages/ReportPage";
import { getMockReport } from "./services/mockReport";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { generateHealthReport, selectHealthLoading } from "./store/healthSlice";
import type { HealthFormValues } from "./types/healthReport";

function App() {
  const initialReport = useMemo(() => getMockReport(), []);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectHealthLoading);
  const [activePage, setActivePage] = useState<"form" | "report">("form");

  const initialFormValues: HealthFormValues = {
    fullName: initialReport.profile.fullName,
    age: initialReport.profile.age,
    gender: initialReport.profile.gender,
    heightCm: initialReport.profile.heightCm,
    currentWeightKg: initialReport.profile.currentWeightKg,
    goalWeightKg: initialReport.profile.goalWeightKg,
    goal: initialReport.profile.goal,
    exerciseMinutesPerDay: initialReport.profile.exerciseMinutesPerDay,
  };

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
          <div>
            <Space direction="vertical" size={0}>
              <Typography.Title level={2} className="app-title">
                HealthyMe Care Report
              </Typography.Title>
              <Typography.Text className="app-subtitle">
                Mocked dashboard for patient tracking and progress insights.
              </Typography.Text>
            </Space>
          </div>
          <div className="switcher-col app_header_switcher">
            <Segmented
              size="large"
              value={activePage}
              onChange={(value) => setActivePage(value as "form" | "report")}
              options={[
                { value: "form", label: "FormPage" },
                { value: "report", label: "ReportPage" },
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
