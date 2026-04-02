import { Card, Table, Tag, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ExerciseRecord } from "../../types/healthReport.type";
import styles from "./ExerciseTable.module.scss";

type ExerciseTableProps = {
  data: ExerciseRecord[];
};

const weekdayOrder: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const weekdayLabelMap: Record<string, string> = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

function toWeekdayLabel(value: string): string {
  if (weekdayLabelMap[value]) {
    return weekdayLabelMap[value];
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const jsDay = parsed.getDay();
  const englishWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return englishWeekdays[jsDay] ?? value;
}

function getWeekdayOrder(value: string): number {
  if (weekdayOrder[value]) {
    return weekdayOrder[value];
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return Number.MAX_SAFE_INTEGER;
  }

  const jsDay = parsed.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

const intensityColorMap: Record<ExerciseRecord["intensity"], string> = {
  Low: "green",
  Moderate: "blue",
  High: "red",
};

function getColumns(isMobile: boolean): ColumnsType<ExerciseRecord> {
  const baseWidth = isMobile ? 90 : 95;
  const activityWidth = isMobile ? 100 : 120;
  const durationWidth = isMobile ? 90 : 90;
  const caloriesWidth = isMobile ? 85 : 100;
  const intensityWidth = isMobile ? 80 : 90;

  return [
    {
      title: "Weekday",
      dataIndex: "date",
      key: "date",
      width: baseWidth,
      render: (value: string) => toWeekdayLabel(value),
    },
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      width: activityWidth,
    },
    {
      title: "Duration",
      dataIndex: "durationMinutes",
      key: "durationMinutes",
      width: durationWidth,
      render: (value: number) => `${value} min`,
    },
    {
      title: "Calories",
      dataIndex: "caloriesBurned",
      key: "caloriesBurned",
      width: caloriesWidth,
      render: (value: number) => `${value} kcal`,
    },
    {
      title: "Intensity",
      dataIndex: "intensity",
      key: "intensity",
      width: intensityWidth,
      render: (value: ExerciseRecord["intensity"]) => (
        <Tag color={intensityColorMap[value]}>{value}</Tag>
      ),
    },
  ];
}

function ExerciseTable({ data }: ExerciseTableProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const columns = getColumns(isMobile);
  const sortedData = [...data].sort(
    (a, b) => getWeekdayOrder(a.date) - getWeekdayOrder(b.date),
  );

  return (
    <Card title="Exercise Log" bordered={false} className={styles.card}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={sortedData}
        pagination={false}
        scroll={{ x: isMobile ? 400 : 500 }}
        className={styles.exercise_table}
      />
    </Card>
  );
}

export default ExerciseTable;
