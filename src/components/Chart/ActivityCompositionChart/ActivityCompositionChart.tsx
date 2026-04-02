import { Pie } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { ActivityCompositionDatum } from "@/utils/reportTransform";
import ChartTitle from "../ChartTitle";
import styles from "./ActivityCompositionChart.module.scss";

type ActivityCompositionChartProps = {
  data: ActivityCompositionDatum[];
};

function ActivityCompositionChart({ data }: ActivityCompositionChartProps) {
  const title = (
    <ChartTitle
      title="Activity Composition"
      description="Shows how your activity time is split across different movement categories in this report."
    />
  );

  if (!data.length) {
    return (
      <Card title={title} bordered={false} className={styles.card}>
        <Empty
          description="No activity data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title={title} bordered={false} className={styles.card}>
      <Pie
        data={data}
        angleField="value"
        colorField="type"
        label={{
          text: "type",
          position: "outside",
        }}
        legend={{ color: { title: false, position: "right" } }}
        statistic={{
          title: {
            offsetY: 8,
            content: "Activity Mix",
          },
          content: {
            offsetY: 4,
            style: {
              fontSize: "14px",
            },
            content: "% Distribution",
          },
        }}
        tooltip={{
          title: (datum: ActivityCompositionDatum) => datum.type,
          items: [
            {
              field: "value",
              name: "",
              valueFormatter: (value) => `${value}%`,
            },
          ],
        }}
        height={260}
      />
    </Card>
  );
}

export default ActivityCompositionChart;
