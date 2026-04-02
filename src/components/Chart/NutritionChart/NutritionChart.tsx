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
          title: (datum: NutritionChartDatum) => datum.label,
          items: [
            {
              field: "value",
              name: "Amount",
              valueFormatter: (value) => `${value} g`,
            },
          ],
          domStyles: {
            "g2-tooltip": {
              backgroundColor: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
            },
            "g2-tooltip-title": {
              color: "#111827",
            },
            "g2-tooltip-list-item-name": {
              color: "#374151",
            },
            "g2-tooltip-list-item-value": {
              color: "#111827",
            },
          },
        }}
        height={260}
      />
    </Card>
  );
}

export default NutritionChart;
