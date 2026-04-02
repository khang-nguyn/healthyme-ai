import { Card, Timeline as AntTimeline } from "antd";
import type { TimelineEvent } from "../../types/healthReport.type";
import { classNames } from "@/utils/classNames";
import styles from "./Timeline.module.scss";

type TimelineProps = {
  data: TimelineEvent[];
};

function formatDateToMMDDYYYY(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const year = parsed.getFullYear();

  return `${month}/${day}/${year}`;
}

function Timeline({ data }: TimelineProps) {
  return (
    <Card
      title="Care Timeline"
      bordered={false}
      className={classNames(styles.card, "h-full")}
    >
      <AntTimeline
        items={data.map((item) => ({
          children: (
            <div>
              <strong>{item.title}</strong>
              <div>{formatDateToMMDDYYYY(item.date)}</div>
              <div>{item.detail}</div>
            </div>
          ),
        }))}
      />
    </Card>
  );
}

export default Timeline;
