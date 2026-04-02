import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ExerciseRecord } from "../../types/healthReport.type";
import styles from "./ExerciseTable.module.scss";

type ExerciseTableProps = {
  data: ExerciseRecord[];
};

const intensityColorMap: Record<ExerciseRecord["intensity"], string> = {
  Low: "green",
  Moderate: "blue",
  High: "red",
};

const columns: ColumnsType<ExerciseRecord> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Activity",
    dataIndex: "activity",
    key: "activity",
  },
  {
    title: "Duration",
    dataIndex: "durationMinutes",
    key: "durationMinutes",
    render: (value: number) => `${value} min`,
  },
  {
    title: "Calories",
    dataIndex: "caloriesBurned",
    key: "caloriesBurned",
    render: (value: number) => `${value} kcal`,
  },
  {
    title: "Intensity",
    dataIndex: "intensity",
    key: "intensity",
    render: (value: ExerciseRecord["intensity"]) => (
      <Tag color={intensityColorMap[value]}>{value}</Tag>
    ),
  },
];

function ExerciseTable({ data }: ExerciseTableProps) {
  return (
    <Card title="Exercise Log" bordered={false} className={styles.card}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 640 }}
      />
    </Card>
  );
}

export default ExerciseTable;
