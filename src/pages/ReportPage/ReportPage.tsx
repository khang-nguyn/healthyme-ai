import { Alert, Button, Card, Empty, Skeleton, Space, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Text from "@/components/Text";
import ExerciseTable from "@/components/ExerciseTable";
import NutritionChart from "@/components/Chart/NutritionChart";
import Summary from "@/components/Summary";
import Timeline from "@/components/Timeline";
import WeightChart from "@/components/Chart/WeightChart";
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
import { classNames } from "@/utils/classNames";
import styles from "./ReportPage.module.scss";

type ReportPageProps = {
  onBackToForm: () => void;
};

function ReportPage({ onBackToForm }: ReportPageProps) {
  const rawReport = useAppSelector(selectHealthReport);
  const loading = useAppSelector(selectHealthLoading);
  const error = useAppSelector(selectHealthError);
  const report = sanitizeHealthReport(rawReport);
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfFirstPageRef = useRef<HTMLDivElement>(null);
  const pdfSecondPageRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!pdfFirstPageRef.current || !pdfSecondPageRef.current) return;

    try {
      message.loading({ content: "Generating PDF...", key: "pdf-download" });

      const captureOptions = {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      };

      const firstPageCanvas = await html2canvas(
        pdfFirstPageRef.current,
        captureOptions,
      );
      const secondPageCanvas = await html2canvas(
        pdfSecondPageRef.current,
        captureOptions,
      );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const maxContentWidth = pageWidth - margin * 2;
      const maxContentHeight = pageHeight - margin * 2;

      const addCenteredCanvas = (
        canvas: HTMLCanvasElement,
        withNewPage: boolean,
      ) => {
        if (withNewPage) {
          pdf.addPage();
        }

        const imageData = canvas.toDataURL("image/png");
        let renderWidth = maxContentWidth;
        let renderHeight = (canvas.height * renderWidth) / canvas.width;

        if (renderHeight > maxContentHeight) {
          renderHeight = maxContentHeight;
          renderWidth = (canvas.width * renderHeight) / canvas.height;
        }

        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;
        pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight);
      };

      addCenteredCanvas(firstPageCanvas, false);
      addCenteredCanvas(secondPageCanvas, true);

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
        <Card bordered={false} className={styles.content_card}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
        <div className={styles.report_grid_2}>
          <div>
            <Card bordered={false} className={styles.content_card}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
          <div>
            <Card bordered={false} className={styles.content_card}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </div>
        </div>
      </Space>
    );
  }

  if (!report) {
    return (
      <Card bordered={false} className={styles.content_card}>
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
      className={styles.report_page}
    >
      <div
        className={classNames(styles.report_toolbar, styles.report_action_col)}
      >
        <Space>
          <Button
            type="primary"
            className={styles.report_primary_btn}
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button
            className={styles.report_secondary_btn}
            onClick={onBackToForm}
          >
            Back to Form
          </Button>
        </Space>
      </div>

      <div ref={reportRef} className={styles.report_surface}>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <div ref={pdfFirstPageRef}>
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              <div className={styles.report_header_bar}>
                <Text
                  type="h3"
                  className={classNames(
                    styles.section_title,
                    styles.report_title,
                  )}
                >
                  Health Care Report
                </Text>
                <Text
                  type="p"
                  variant="secondary"
                  className={styles.section_subtitle}
                >
                  Report generated from the submitted form inputs.
                </Text>
              </div>

              {error ? (
                <Alert
                  type="warning"
                  showIcon
                  message="Latest request returned an error"
                  description="Showing the most recent valid report data."
                />
              ) : null}

              <div
                className={classNames(
                  styles.summary_single,
                  styles.report_section_card,
                )}
              >
                <Summary report={report} />
              </div>

              <div className={styles.report_grid_main}>
                <div className={styles.report_section_card}>
                  <ExerciseTable data={report.exercises ?? []} />
                </div>
                <div className={styles.report_section_card}>
                  <Timeline data={report.timeline ?? []} />
                </div>
              </div>
            </Space>
          </div>

          <div ref={pdfSecondPageRef}>
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              <div className={styles.report_grid_2}>
                <div className={styles.report_section_card}>
                  <NutritionChart data={nutritionChartData} />
                </div>
                <div className={styles.report_section_card}>
                  <WeightChart
                    data={weightChartData}
                    goalWeightKg={report.profile.goalWeightKg}
                  />
                </div>
              </div>

              <div className={styles.report_grid_2}>
                <div className={styles.report_section_card}>
                  <ExerciseEffortChart data={exerciseEffortData} />
                </div>
                <div className={styles.report_section_card}>
                  <ActivityCompositionChart data={activityData} />
                </div>
              </div>

              <div className={styles.report_section_card}>
                <BodyCompositionChart data={bodyCompositionData} />
              </div>
            </Space>
          </div>
        </Space>
      </div>
    </Space>
  );
}

export default ReportPage;
