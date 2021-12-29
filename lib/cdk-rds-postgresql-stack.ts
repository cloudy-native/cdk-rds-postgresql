import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  AuroraPostgresEngineVersion,
  DatabaseCluster,
  DatabaseClusterEngine,
} from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export class CdkRdsPostgresqlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "vpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    const securityGroup = new SecurityGroup(this, "security-group", {
      vpc,
    });
    securityGroup.addIngressRule(Peer.ipv4("100.0.58.54/32"), Port.tcp(5432));

    const database = new DatabaseCluster(this, "database", {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_13_4,
      }),
      instanceProps: {
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
        vpc,
        securityGroups: [securityGroup],
      },
    });

    new CfnOutput(this, "endpoint", {
      value: database.clusterEndpoint.hostname,
    });
  }
}
