import { Line } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { WeightChartDatum } from "@/utils/reportTransform";
import styles from "./WeightChart.module.scss";

type WeightChartProps = {
  data: WeightChartDatum[];
  goalWeightKg: number;
};

function WeightChart({ data, goalWeightKg }: WeightChartProps) {
  if (!data.length) {
    return (
      <Card title="Weight Progress" bordered={false} className={styles.card}>
        <Empty
          description="No weight history"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const chartData = data.flatMap((point) => [
    { ...point, series: "Actual" },
    { x: point.x, y: goalWeightKg, series: "Goal" },
  ]);

  return (
    <Card title="Weight Progress" bordered={false} className={styles.card}>
      <Line
        data={chartData}
        xField="x"
        yField="y"
        colorField="series"
        point={{ shapeField: "circle", sizeField: 4 }}
        interaction={{ tooltip: { marker: false } }}
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
          items: [{ channel: "y", valueFormatter: (value) => `${value} kg` }],
        }}
        height={260}
      />
    </Card>
  );
}

export default WeightChart;
