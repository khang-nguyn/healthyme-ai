import { Pie } from "@ant-design/charts";
import { Card, Empty } from "antd";
import type { BodyCompositionDatum } from "@/utils/reportTransform";
import styles from "./BodyCompositionChart.module.scss";

type BodyCompositionChartProps = {
  data: BodyCompositionDatum[];
};

function BodyCompositionChart({ data }: BodyCompositionChartProps) {
  if (!data.length) {
    return (
      <Card title="Body Composition" bordered={false} className={styles.card}>
        <Empty
          description="No body composition data"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Body Composition" bordered={false} className={styles.card}>
      <Pie
        data={data}
        angleField="value"
        colorField="type"
        label={{ text: "type", position: "outside" }}
        legend={{ color: { title: false, position: "right" } }}
        tooltip={{
          formatter: (datum: BodyCompositionDatum) => ({
            name: datum.type,
            value: `${datum.value}%`,
          }),
        }}
        height={260}
      />
    </Card>
  );
}

export default BodyCompositionChart;
