import { Pie } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { ActivityCompositionDatum } from "@/utils/reportTransform";
import styles from "./ActivityCompositionChart.module.scss";

type ActivityCompositionChartProps = {
  data: ActivityCompositionDatum[];
};

function ActivityCompositionChart({ data }: ActivityCompositionChartProps) {
  if (!data.length) {
    return (
      <Card
        title="Activity Composition"
        bordered={false}
        className={styles.card}
      >
        <Empty
          description="No activity data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Activity Composition" bordered={false} className={styles.card}>
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
          formatter: (datum: ActivityCompositionDatum) => ({
            name: datum.type,
            value: `${datum.value}%`,
          }),
        }}
        height={260}
      />
    </Card>
  );
}

export default ActivityCompositionChart;
