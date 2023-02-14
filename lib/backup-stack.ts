import {Construct} from "constructs";
import {Duration, NestedStack, NestedStackProps} from "aws-cdk-lib";
import {BackupPlan, BackupPlanRule, BackupResource} from "aws-cdk-lib/aws-backup";
import {Schedule} from "aws-cdk-lib/aws-events";

export interface BackupStackProps extends NestedStackProps {

}

export class BackupStack extends NestedStack {

  private daily(days: number): BackupPlanRule {
    return new BackupPlanRule({
      ruleName: "Daily",
      scheduleExpression: Schedule.cron({
        hour: "5",
        minute: "0"
      }),
      deleteAfter: Duration.days(days)
    });
  }

  private weekly(days: number): BackupPlanRule {
    return new BackupPlanRule({
      ruleName: "Weekly",
      scheduleExpression: Schedule.cron({
        hour: "5",
        minute: "0",
        weekDay: "SAT",
      }),
      deleteAfter: Duration.days(days)
    });
  }

  private monthly(days: number): BackupPlanRule {
    return new BackupPlanRule({
      ruleName: "Monthly",
      scheduleExpression: Schedule.cron({
        day: "1",
        hour: "5",
        minute: "0"
      }),
      moveToColdStorageAfter: Duration.days(30),
      deleteAfter: Duration.days(days)
    })
  }

  private tagSelection(plan: BackupPlan, tagValue: string) {
    plan.addSelection("Selection", {
      resources: [
        BackupResource.fromTag("backup:policy", tagValue)
      ]
    });
  }

  constructor(scope: Construct, id: string, props: BackupStackProps) {
    super(scope, id, props);

    const defaultWeek = new BackupPlan(this, "DefaultWeek", {
      backupPlanRules: [
        this.daily(7)
      ]
    });
    this.tagSelection(defaultWeek, "default-week");


    const defaultMonth = new BackupPlan(this, "DefaultMonth", {
      backupPlanRules: [
        this.daily(35)
      ]
    });
    this.tagSelection(defaultMonth, "default-month");

    const defaultQuarter = new BackupPlan(this, "DefaultQuarter", {
      backupPlanRules: [
        this.daily(35),
        this.weekly(90)
      ]
    });
    this.tagSelection(defaultQuarter, "default-quarter");

    const defaultDaily35Weekly90Monthly365 = new BackupPlan(this, "DefaultYear", {
      backupPlanRules: [
        this.daily(35),
        this.weekly(90),
        this.monthly(365)
      ]
    });
    this.tagSelection(defaultDaily35Weekly90Monthly365, "default-year");

    const defaultDaily35Weekly90Monthly2555 = new BackupPlan(this, "Default7Years", {
      backupPlanRules: [
        this.daily(35),
        this.weekly(90),
        this.monthly(2555)
      ]
    });
    this.tagSelection(defaultDaily35Weekly90Monthly2555, "default-7-years");
  }
}