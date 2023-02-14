#!/usr/bin/env node
import 'source-map-support/register';
import { AccountFoundationStack } from '../lib/account-foundation-stack';
import {ExtendedApp} from "truemark-cdk-lib/aws-cdk";

const app = new ExtendedApp();
new AccountFoundationStack(app, "AccountFoundation", {});
