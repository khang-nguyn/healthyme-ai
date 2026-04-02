import { Line } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { ExerciseEffortDatum } from "@/utils/reportTransform";
import styles from "./ExerciseEffortChart.module.scss";

type ExerciseEffortChartProps = {
  data: ExerciseEffortDatum[];
};

function ExerciseEffortChart({ data }: ExerciseEffortChartProps) {
  if (!data.length) {
    return (
      <Card title="Exercise Effort" bordered={false} className={styles.card}>
        <Empty
          description="No exercise data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const chartData = data.flatMap((item) => [
    { date: item.date, value: item.calories, metric: "Calories (kcal)" },
    { date: item.date, value: item.duration, metric: "Duration (min)" },
  ]);

  return (
    <Card
      title="Exercise Effort - Calories & Duration"
      bordered={false}
      className={styles.card}
    >
      <Line
        data={chartData}
        xField="date"
        yField="value"
        colorField="metric"
        point={{ shapeField: "circle", sizeField: 4 }}
        axis={{
          x: {
            labelFormatter: (value: string) => {
              const date = new Date(value);
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${month}/${day}`;
            },
          },
          y: { title: false },
        }}
        tooltip={{
          items: [{ channel: "y", valueFormatter: (value) => `${value}` }],
        }}
        height={260}
      />
    </Card>
  );
}

export default ExerciseEffortChart;
