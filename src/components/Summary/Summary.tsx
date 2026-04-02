import { Card, Statistic } from "antd";
import styles from "./Summary.module.scss";
import type { HealthReport } from "@/types/healthReport.type";
import { classNames } from "@/utils/classNames";
import { getBmiStatus } from "@/utils/bmiCalculator";

type SummaryProps = {
  report: HealthReport;
};

function Summary({ report }: SummaryProps) {
  const { profile, summary } = report;
  const bmiStatus = getBmiStatus(summary.bmi);

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
          <div className={styles.meta_line}>
            <span className={styles.meta_label}>Goal Weight:</span>{" "}
            {profile.goalWeightKg} kg
          </div>
        </div>

        <div className={styles.profile_tags}>
          <div
            className={classNames(
              styles.profile_badge,
              styles.profile_badge_age,
            )}
          >
            <span className={styles.profile_badge_label}>Age</span>
            <span className={styles.profile_badge_value}>
              {profile.age} years
            </span>
          </div>
          <div
            className={classNames(
              styles.profile_badge,
              styles.profile_badge_gender,
            )}
          >
            <span className={styles.profile_badge_label}>Gender</span>
            <span className={styles.profile_badge_value}>{profile.gender}</span>
          </div>
          <div
            className={classNames(
              styles.profile_badge,
              styles.profile_badge_height,
            )}
          >
            <span className={styles.profile_badge_label}>Height</span>
            <span className={styles.profile_badge_value}>
              {profile.heightCm} cm
            </span>
          </div>
          <div
            className={classNames(
              styles.profile_badge,
              styles.profile_badge_weight,
            )}
          >
            <span className={styles.profile_badge_label}>Current Weight</span>
            <span className={styles.profile_badge_value}>
              {profile.currentWeightKg} kg
            </span>
          </div>
        </div>
      </div>

      <div className={styles.stats_grid}>
        <div className={classNames(styles.stat_item, styles.bmi_card)}>
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
