import {
  Alert,
  Button,
  Card,
  Empty,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ExerciseTable from "@/components/ExerciseTable";
import NutritionChart from "@/components/Chart/NutritionChart";
import Summary from "@/components/Summary";
import Timeline from "@/components/Timeline";
import WeightChart from "@/components/WeightChart";
import ActivityCompositionChart from "@/components/Chart/ActivityCompositionChart";
import BodyCompositionChart from "@/components/Chart/BodyCompositionChart";
import ExerciseEffortChart from "@/components/Chart/ExerciseEffortChart";
import { useAppSelector } from "@/store/hooks";
import {
  selectHealthError,
  selectHealthLoading,
  selectHealthReport,
} from "@/store/healthSlice";
import {
  sanitizeHealthReport,
  toNutritionChartData,
  toWeightChartData,
  toActivityCompositionData,
  toBodyCompositionData,
  toExerciseEffortData,
} from "@/utils/reportTransform";

type ReportPageProps = {
  onBackToForm: () => void;
};

function ReportPage({ onBackToForm }: ReportPageProps) {
  const rawReport = useAppSelector(selectHealthReport);
  const loading = useAppSelector(selectHealthLoading);
  const error = useAppSelector(selectHealthError);
  const report = sanitizeHealthReport(rawReport);
  const reportRef = useRef<HTMLDivElement>(null);

  console.log("🚀 ~ ReportPage ~ rawReport:", rawReport);
  console.log("🚀 ~ ReportPage ~ report:", report);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      message.loading({ content: "Generating PDF...", key: "pdf-download" });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      let heightLeft = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, heightLeft);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - canvas.height;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, heightLeft);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `HealthReport_${report?.profile.fullName}_${new Date().toISOString().split("T")[0]}.pdf`,
      );

      message.success({
        content: "PDF downloaded successfully!",
        key: "pdf-download",
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      message.error({
        content: "Failed to generate PDF",
        key: "pdf-download",
      });
    }
  };

  if (loading) {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card bordered={false} className="content-card">
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
        <div className="report_grid_2">
          <div>
            <Card bordered={false} className="content-card">
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
          <div>
            <Card bordered={false} className="content-card">
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
        </div>
      </Space>
    );
  }

  if (!report) {
    return (
      <Card bordered={false} className="content-card">
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {error ? (
            <Alert
              type="error"
              showIcon
              message="Report generation failed"
              description={error}
            />
          ) : null}
          <Empty
            description="No report data yet. Submit the form to generate a report."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="default" onClick={onBackToForm}>
            Back to Form
          </Button>
        </Space>
      </Card>
    );
  }

  const nutritionChartData = toNutritionChartData(report.nutrition);
  const weightChartData = toWeightChartData(report.weightHistory);
  const activityData = toActivityCompositionData(report.activityComposition);
  const bodyCompositionData = toBodyCompositionData(report.bodyComposition);
  const exerciseEffortData = toExerciseEffortData(report.exerciseEffort);

  return (
    <Space
      direction="vertical"
      size={16}
      style={{ width: "100%" }}
      className="report_page"
    >
      <div className="report_toolbar report-action-col">
        <Space>
          <Button
            type="primary"
            className="report_primary_btn"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button className="report_secondary_btn" onClick={onBackToForm}>
            Back to Form
          </Button>
        </Space>
      </div>

      <div ref={reportRef} className="report_surface">
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <div className="report_header_bar">
            <Typography.Title level={3} className="section-title report-title">
              Health Care Report
            </Typography.Title>
            <Typography.Text type="secondary" className="section-subtitle">
              Report generated from mock data and current form inputs.
            </Typography.Text>
          </div>

          {error ? (
            <Alert
              type="warning"
              showIcon
              message="Latest request returned an error"
              description="Showing the most recent valid report data."
            />
          ) : null}

          <div className="summary_single report_section_card">
            <Summary report={report} />
          </div>

          <div className="report_grid_main">
            <div className="report_section_card">
              <ExerciseTable data={report.exercises ?? []} />
            </div>
            <div className="report_section_card">
              <Timeline data={report.timeline ?? []} />
            </div>
          </div>

          <div className="report_grid_2">
            <div className="report_section_card">
              <NutritionChart data={nutritionChartData} />
            </div>
            <div className="report_section_card">
              <WeightChart
                data={weightChartData}
                goalWeightKg={report.profile.goalWeightKg}
              />
            </div>
          </div>

          <div className="report_grid_2">
            <div className="report_section_card">
              <ExerciseEffortChart data={exerciseEffortData} />
            </div>
            <div className="report_section_card">
              <ActivityCompositionChart data={activityData} />
            </div>
          </div>

          <div className="report_section_card">
            <BodyCompositionChart data={bodyCompositionData} />
          </div>
        </Space>
      </div>
    </Space>
  );
}

export default ReportPage;
