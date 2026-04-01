import { Pie } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { NutritionChartDatum } from "@/utils/reportTransform";
import styles from "./NutritionChart.module.scss";

type NutritionChartProps = {
  data: NutritionChartDatum[];
};

function NutritionChart({ data }: NutritionChartProps) {
  if (!data.length) {
    return (
      <Card title="Nutrition Balance" bordered={false} className={styles.card}>
        <Empty
          description="No nutrition data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Nutrition Balance" bordered={false} className={styles.card}>
      <Pie
        data={data}
        angleField="value"
        colorField="label"
        label={{ text: "label", position: "outside" }}
        legend={{ color: { title: false, position: "right" } }}
        tooltip={{
          formatter: (datum: NutritionChartDatum) => ({
            name: datum.label,
            value: `${datum.value} g`,
          }),
        }}
        height={260}
      />
    </Card>
  );
}

export default NutritionChart;
