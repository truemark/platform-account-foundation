import { Construct } from 'constructs';
import {ExtendedStack, ExtendedStackProps} from "truemark-cdk-lib/aws-cdk";
import {BackupStack} from "./backup-stack";

export interface AccountFoundationStackProps extends ExtendedStackProps {

}

export class AccountFoundationStack extends ExtendedStack {
  constructor(scope: Construct, id: string, props: AccountFoundationStackProps) {
    super(scope, id, props);

    new BackupStack(this, "Backups", {});

  }
}
