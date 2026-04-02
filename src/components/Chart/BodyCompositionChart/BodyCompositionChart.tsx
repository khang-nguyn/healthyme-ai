import { Pie } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { BodyCompositionDatum } from "@/utils/reportTransform";
import ChartTitle from "../ChartTitle";
import styles from "./BodyCompositionChart.module.scss";

type BodyCompositionChartProps = {
  data: BodyCompositionDatum[];
};

function BodyCompositionChart({ data }: BodyCompositionChartProps) {
  const title = (
    <ChartTitle
      title="Body Composition"
      description="Shows the relative breakdown of body composition indicators used in the report summary."
    />
  );

  if (!data.length) {
    return (
      <Card title={title} bordered={false} className={styles.card}>
        <Empty
          description="No body composition data"
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
        label={{ text: "type", position: "outside" }}
        legend={{ color: { title: false, position: "right" } }}
        tooltip={{
          title: (datum: BodyCompositionDatum) => datum.type,
          items: [
            {
              field: "value",
              name: "",
              valueFormatter: (value) => `${value}%`,
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

export default BodyCompositionChart;
