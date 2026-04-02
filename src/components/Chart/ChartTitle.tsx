import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import type { ReactNode } from "react";
import styles from "./ChartTitle.module.scss";

type ChartTitleProps = {
  title: string;
  description: string;
  extra?: ReactNode;
};

function ChartTitle({ title, description, extra }: ChartTitleProps) {
  return (
    <div className={styles.chart_title_row}>
      <span className={styles.chart_title_text}>{title}</span>
      <div className={styles.chart_title_actions}>
        {extra}
        <Tooltip title={description} placement="topRight">
          <InfoCircleOutlined className={styles.chart_title_icon} />
        </Tooltip>
      </div>
    </div>
  );
}

export default ChartTitle;
