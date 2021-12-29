#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkRdsPostgresqlStack } from '../lib/cdk-rds-postgresql-stack';

const app = new cdk.App();
new CdkRdsPostgresqlStack(app, 'CdkRdsPostgresqlStack');
