import { Card, Timeline as AntTimeline } from "antd";
import type { TimelineEvent } from "../../types/healthReport.type";
import styles from "./Timeline.module.scss";

type TimelineProps = {
  data: TimelineEvent[];
};

function Timeline({ data }: TimelineProps) {
  return (
    <Card
      title="Care Timeline"
      bordered={false}
      className={`${styles.card} h-full`}
    >
      <AntTimeline
        items={data.map((item) => ({
          children: (
            <div>
              <strong>{item.title}</strong>
              <div>{item.date}</div>
              <div>{item.detail}</div>
            </div>
          ),
        }))}
      />
    </Card>
  );
}

export default Timeline;
