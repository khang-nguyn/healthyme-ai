import { Card, Statistic, Tag } from "antd";
import type { HealthReport } from "../../types/healthReport";
import styles from "./Summary.module.scss";

type SummaryProps = {
  report: HealthReport;
};

function Summary({ report }: SummaryProps) {
  const { profile, summary } = report;
  const bmiStatus =
    summary.bmi < 18.5
      ? "Underweight"
      : summary.bmi < 25
        ? "Healthy"
        : summary.bmi < 30
          ? "Overweight"
          : "Obesity";

  return (
    <Card bordered={false} className={styles.card}>
      <div className={styles.top_row}>
        <div className={styles.patient_meta}>
          <div className={styles.meta_line}>
            <span className={styles.meta_label}>Patient:</span>{" "}
            {profile.fullName}
          </div>
          <div className={styles.meta_line}>
            <span className={styles.meta_label}>Goal:</span> {profile.goal}
          </div>
        </div>

        <div className={styles.profile_tags}>
          <Tag className="b">{profile.age} years</Tag>
          <Tag>{profile.gender}</Tag>
          <Tag>{profile.heightCm} cm</Tag>
          <Tag>{profile.currentWeightKg} kg</Tag>
        </div>
      </div>

      <div className={styles.stats_grid}>
        <div className={`${styles.stat_item} ${styles.bmi_card}`}>
          <Statistic title="BMI" value={summary.bmi} precision={1} />
          <div className={styles.bmi_status}>{bmiStatus}</div>
        </div>
        <div className={styles.stat_item}>
          <Statistic
            title="Body Fat"
            value={summary.bodyFatPercent}
            suffix="%"
            precision={1}
          />
        </div>
        <div className={styles.stat_item}>
          <Statistic
            title="Resting HR"
            value={summary.restingHeartRate}
            suffix="bpm"
          />
        </div>
        <div className={styles.stat_item}>
          <Statistic title="Blood Pressure" value={summary.bloodPressure} />
        </div>
        <div className={styles.stat_item}>
          <Statistic
            title="Sleep"
            value={summary.sleepHours}
            suffix="h"
            precision={1}
          />
        </div>
      </div>

      <div className={styles.health_summary_paragraph}>
        <strong>Key Insights</strong>
        <p>{summary.healthSummaryParagraph}</p>
      </div>
    </Card>
  );
}

export default Summary;
