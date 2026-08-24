import type { Accent } from "./types";

export interface CheatCommand {
  cmd: string;
  desc: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatSheet {
  id: string;
  tool: string;
  blurb: string;
  accent: Accent;
  sections: CheatSection[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "cli",
    tool: "AWS CLI core",
    blurb: "Identity, profiles, regions, and the flags that make every other command readable.",
    accent: "iris",
    sections: [
      {
        title: "Who am I, and where",
        commands: [
          { cmd: "aws sts get-caller-identity", desc: "The first command to run when anything is denied — account, user/role ARN, user ID." },
          { cmd: "aws configure list", desc: "Show the resolved profile, region, and where each value came from." },
          { cmd: "aws configure sso", desc: "Set up an IAM Identity Center (SSO) profile interactively." },
          { cmd: "aws sso login --profile prod", desc: "Refresh expired SSO credentials for a profile." },
          { cmd: "aws --profile prod --region eu-west-1 s3 ls", desc: "Override profile and region for a single command." },
        ],
      },
      {
        title: "Shaping the output",
        commands: [
          { cmd: "aws ec2 describe-instances --output table", desc: "Human-readable table instead of JSON." },
          { cmd: "aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId'", desc: "JMESPath filter — pull just the fields you need." },
          { cmd: "aws ec2 describe-instances --filters Name=instance-state-name,Values=running", desc: "Server-side filter; cheaper and faster than filtering locally." },
          { cmd: "aws s3api list-objects-v2 --bucket b --max-items 10", desc: "Cap results on any paginated call." },
          { cmd: "aws ec2 describe-instances --no-paginate", desc: "Disable auto-pagination when you only want the first page." },
        ],
      },
      {
        title: "Assuming a role",
        commands: [
          { cmd: "aws sts assume-role --role-arn ARN --role-session-name s", desc: "Get temporary credentials for a cross-account or elevated role." },
          { cmd: "aws configure set profile.deploy.role_arn ARN", desc: "Store a role in a named profile so the CLI assumes it for you." },
          { cmd: "aws sts get-session-token --serial-number MFA_ARN --token-code 123456", desc: "MFA-backed temporary credentials." },
        ],
      },
    ],
  },
  {
    id: "ec2",
    tool: "EC2 & networking",
    blurb: "Instances, security groups, and the VPC plumbing that decides whether traffic arrives.",
    accent: "teal",
    sections: [
      {
        title: "Instances",
        commands: [
          { cmd: "aws ec2 describe-instances", desc: "List instances with their state, type, IPs, and tags." },
          { cmd: "aws ec2 run-instances --image-id ami-x --instance-type t3.micro --count 1", desc: "Launch an instance." },
          { cmd: "aws ec2 stop-instances --instance-ids i-x", desc: "Stop an instance (EBS-backed; billing for compute stops)." },
          { cmd: "aws ec2 terminate-instances --instance-ids i-x", desc: "Terminate permanently — the root volume goes with it by default." },
          { cmd: "aws ec2 describe-instance-status --instance-ids i-x", desc: "System and instance status checks — the health signal behind an unreachable host." },
        ],
      },
      {
        title: "Security groups & VPC",
        commands: [
          { cmd: "aws ec2 describe-security-groups --group-ids sg-x", desc: "Inspect inbound and outbound rules." },
          { cmd: "aws ec2 authorize-security-group-ingress --group-id sg-x --protocol tcp --port 443 --cidr 0.0.0.0/0", desc: "Open a port inbound." },
          { cmd: "aws ec2 revoke-security-group-ingress --group-id sg-x --protocol tcp --port 22 --cidr 0.0.0.0/0", desc: "Close a rule — the standard fix for an open-SSH finding." },
          { cmd: "aws ec2 describe-subnets --filters Name=vpc-id,Values=vpc-x", desc: "List a VPC's subnets with their AZs and CIDRs." },
          { cmd: "aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-x", desc: "See where each subnet actually routes — public vs private is a route, not a name." },
          { cmd: "aws ec2 describe-nat-gateways", desc: "Find NAT gateways (and the hourly charge attached to each)." },
        ],
      },
      {
        title: "Access without SSH",
        commands: [
          { cmd: "aws ssm start-session --target i-x", desc: "Shell into an instance via Session Manager — no key pair, no open port 22." },
          { cmd: "aws ec2-instance-connect send-ssh-public-key --instance-id i-x --instance-os-user ec2-user --ssh-public-key file://k.pub", desc: "Push a one-time SSH key valid for 60 seconds." },
        ],
      },
    ],
  },
  {
    id: "s3",
    tool: "S3",
    blurb: "Objects in, objects out, and the settings that decide who else can read them.",
    accent: "amber",
    sections: [
      {
        title: "Everyday transfer",
        commands: [
          { cmd: "aws s3 ls s3://bucket/prefix/", desc: "List objects under a prefix." },
          { cmd: "aws s3 cp file s3://bucket/key", desc: "Upload a single object." },
          { cmd: "aws s3 sync ./dir s3://bucket/prefix --delete", desc: "Mirror a directory; --delete removes objects no longer present locally." },
          { cmd: "aws s3 cp s3://bucket/key - | head", desc: "Stream an object to stdout without writing a file." },
          { cmd: "aws s3 presign s3://bucket/key --expires-in 3600", desc: "Generate a time-limited URL for someone without AWS credentials." },
          { cmd: "aws s3 rm s3://bucket/prefix --recursive", desc: "Delete under a prefix — irreversible unless versioning is on." },
        ],
      },
      {
        title: "Bucket configuration",
        commands: [
          { cmd: "aws s3api get-bucket-policy --bucket b", desc: "Read the resource policy — half of every 'why can they see this' question." },
          { cmd: "aws s3api get-public-access-block --bucket b", desc: "Check the four public-access guards." },
          { cmd: "aws s3api put-bucket-versioning --bucket b --versioning-configuration Status=Enabled", desc: "Turn on versioning — your undo button for deletes and overwrites." },
          { cmd: "aws s3api put-bucket-encryption --bucket b --server-side-encryption-configuration file://enc.json", desc: "Set default encryption (SSE-S3 or SSE-KMS)." },
          { cmd: "aws s3api list-object-versions --bucket b --prefix p", desc: "See versions and delete markers behind a 'missing' object." },
          { cmd: "aws s3api get-bucket-lifecycle-configuration --bucket b", desc: "Inspect the transition and expiration rules driving storage cost." },
        ],
      },
    ],
  },
  {
    id: "iam",
    tool: "IAM",
    blurb: "Principals, policies, and how to prove a permission before an incident does it for you.",
    accent: "rose",
    sections: [
      {
        title: "Inspect",
        commands: [
          { cmd: "aws iam get-role --role-name r", desc: "Read a role, including its trust policy — who is allowed to assume it." },
          { cmd: "aws iam list-attached-role-policies --role-name r", desc: "Managed policies attached to a role." },
          { cmd: "aws iam list-role-policies --role-name r", desc: "Inline policies — the ones that hide from the managed-policy list." },
          { cmd: "aws iam get-policy-version --policy-arn ARN --version-id v1", desc: "Read the actual policy document behind an ARN." },
          { cmd: "aws iam generate-credential-report && aws iam get-credential-report", desc: "Account-wide report of users, keys, MFA, and last use." },
        ],
      },
      {
        title: "Prove it",
        commands: [
          { cmd: "aws iam simulate-principal-policy --policy-source-arn ARN --action-names s3:GetObject --resource-arns ARN", desc: "Ask IAM whether a principal is allowed — before deploying, not after." },
          { cmd: "aws iam get-account-authorization-details", desc: "Dump every principal and policy for offline analysis." },
          { cmd: "aws accessanalyzer list-findings --analyzer-arn ARN", desc: "Resources shared outside your account or organization." },
        ],
      },
      {
        title: "Key hygiene",
        commands: [
          { cmd: "aws iam list-access-keys --user-name u", desc: "Find long-lived keys and their age." },
          { cmd: "aws iam update-access-key --user-name u --access-key-id AK --status Inactive", desc: "Disable a key without deleting it — the safe first step in rotation." },
          { cmd: "aws iam delete-access-key --user-name u --access-key-id AK", desc: "Remove it once nothing has broken." },
        ],
      },
    ],
  },
  {
    id: "serverless",
    tool: "Lambda & serverless",
    blurb: "Deploying functions, reading their configuration, and finding out why one timed out.",
    accent: "iris",
    sections: [
      {
        title: "Functions",
        commands: [
          { cmd: "aws lambda list-functions --query 'Functions[].FunctionName'", desc: "Every function name in the region." },
          { cmd: "aws lambda get-function-configuration --function-name f", desc: "Memory, timeout, runtime, role, env vars, VPC config." },
          { cmd: "aws lambda update-function-code --function-name f --zip-file fileb://f.zip", desc: "Ship new code from a local zip." },
          { cmd: "aws lambda update-function-configuration --function-name f --timeout 30 --memory-size 1024", desc: "Raise the timeout or memory (memory also buys CPU)." },
          { cmd: "aws lambda invoke --function-name f --payload '{}' out.json", desc: "Invoke synchronously and capture the response." },
          { cmd: "aws lambda publish-version --function-name f", desc: "Freeze an immutable version to point an alias at." },
          { cmd: "aws lambda update-alias --function-name f --name live --routing-config AdditionalVersionWeights={2=0.1}", desc: "Weighted alias — a canary release in one command." },
        ],
      },
      {
        title: "API Gateway & events",
        commands: [
          { cmd: "aws apigatewayv2 get-apis", desc: "List HTTP and WebSocket APIs." },
          { cmd: "aws lambda get-policy --function-name f", desc: "See which services are permitted to invoke the function." },
          { cmd: "aws lambda list-event-source-mappings --function-name f", desc: "SQS, Kinesis, and DynamoDB stream triggers, with their batch sizes." },
          { cmd: "aws sqs get-queue-attributes --queue-url URL --attribute-names All", desc: "Queue depth, visibility timeout, and the redrive policy behind a DLQ." },
        ],
      },
    ],
  },
  {
    id: "containers",
    tool: "ECS, EKS & ECR",
    blurb: "Pushing images, rolling services, and getting a kubeconfig that works.",
    accent: "teal",
    sections: [
      {
        title: "ECR",
        commands: [
          { cmd: "aws ecr get-login-password | docker login --username AWS --password-stdin ACCT.dkr.ecr.REGION.amazonaws.com", desc: "Authenticate Docker against ECR." },
          { cmd: "aws ecr describe-repositories", desc: "List repositories in the region." },
          { cmd: "aws ecr describe-images --repository-name r --query 'imageDetails[].imageTags'", desc: "Tags currently in a repository." },
          { cmd: "aws ecr start-image-scan --repository-name r --image-id imageTag=latest", desc: "Kick off a vulnerability scan." },
        ],
      },
      {
        title: "ECS",
        commands: [
          { cmd: "aws ecs list-clusters", desc: "Clusters in the region." },
          { cmd: "aws ecs describe-services --cluster c --services s", desc: "Desired vs running count, deployment state, and recent events." },
          { cmd: "aws ecs update-service --cluster c --service s --force-new-deployment", desc: "Redeploy the same task definition — the standard 'pick up the new :latest' move." },
          { cmd: "aws ecs describe-tasks --cluster c --tasks TASK_ARN", desc: "Why a task stopped — read stoppedReason first." },
          { cmd: "aws ecs execute-command --cluster c --task T --container app --command /bin/sh --interactive", desc: "Shell into a running task (ECS Exec)." },
        ],
      },
      {
        title: "EKS",
        commands: [
          { cmd: "aws eks update-kubeconfig --name cluster --region eu-west-1", desc: "Write a kubeconfig entry — the first step on every new machine." },
          { cmd: "aws eks describe-cluster --name cluster", desc: "Endpoint, version, VPC config, and OIDC issuer for IRSA." },
          { cmd: "aws eks list-nodegroups --cluster-name cluster", desc: "Managed node groups behind the cluster." },
        ],
      },
    ],
  },
  {
    id: "observability",
    tool: "CloudWatch & logs",
    blurb: "Finding the log line, the metric, and the alarm that should have fired.",
    accent: "amber",
    sections: [
      {
        title: "Logs",
        commands: [
          { cmd: "aws logs tail /aws/lambda/f --follow", desc: "Live tail a log group — the fastest path from 'it broke' to the stack trace." },
          { cmd: "aws logs tail /aws/lambda/f --since 1h --filter-pattern ERROR", desc: "Recent errors only." },
          { cmd: "aws logs describe-log-groups --log-group-name-prefix /aws/", desc: "Find the right log group when you only half-remember the name." },
          { cmd: "aws logs start-query --log-group-name g --start-time T --end-time T --query-string 'fields @message | filter @message like /timeout/'", desc: "Logs Insights query across a time range." },
          { cmd: "aws logs put-retention-policy --log-group-name g --retention-in-days 30", desc: "Cap retention — log groups default to never expiring, and that is a real bill." },
        ],
      },
      {
        title: "Metrics & alarms",
        commands: [
          { cmd: "aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Errors --dimensions Name=FunctionName,Value=f --start-time T --end-time T --period 300 --statistics Sum", desc: "Pull a metric series without opening the console." },
          { cmd: "aws cloudwatch describe-alarms --state-value ALARM", desc: "Everything currently alarming." },
          { cmd: "aws cloudwatch describe-alarm-history --alarm-name a", desc: "When it fired and what it was told — the flapping-alarm diagnostic." },
          { cmd: "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket", desc: "Who did the thing, from where, and when." },
        ],
      },
    ],
  },
  {
    id: "iac",
    tool: "CloudFormation & cost",
    blurb: "Stacks, drift, and the two commands that answer 'why is the bill up'.",
    accent: "rose",
    sections: [
      {
        title: "CloudFormation",
        commands: [
          { cmd: "aws cloudformation deploy --template-file t.yaml --stack-name s --capabilities CAPABILITY_IAM", desc: "Create or update a stack, waiting for it to settle." },
          { cmd: "aws cloudformation describe-stack-events --stack-name s --max-items 20", desc: "Read failures newest-first — the first ROLLBACK reason is the real one." },
          { cmd: "aws cloudformation detect-stack-drift --stack-name s", desc: "Find resources changed outside the template." },
          { cmd: "aws cloudformation describe-stacks --stack-name s --query 'Stacks[0].Outputs'", desc: "Outputs other stacks and pipelines consume." },
          { cmd: "aws cloudformation delete-stack --stack-name s", desc: "Tear the stack down — retained resources survive, everything else does not." },
        ],
      },
      {
        title: "Cost",
        commands: [
          { cmd: "aws ce get-cost-and-usage --time-period Start=2026-08-01,End=2026-08-31 --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE", desc: "Spend by service for a month." },
          { cmd: "aws ce get-cost-forecast --time-period Start=2026-09-01,End=2026-09-30 --metric UNBLENDED_COST --granularity MONTHLY", desc: "Projected spend for the period ahead." },
          { cmd: "aws budgets describe-budgets --account-id ACCT", desc: "Budgets and their alert thresholds." },
        ],
      },
    ],
  },
];
