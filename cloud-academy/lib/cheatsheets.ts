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
    id: "aws",
    tool: "AWS CLI",
    blurb: "Identity first, then compute, storage, and the permissions that gate both.",
    accent: "amber",
    sections: [
      {
        title: "Identity & context",
        commands: [
          { cmd: "aws sts get-caller-identity", desc: "Account, ARN, and user ID — the first command to run when something is denied." },
          { cmd: "aws configure list", desc: "Which profile and region resolved, and from where." },
          { cmd: "aws sso login --profile prod", desc: "Refresh expired IAM Identity Center credentials." },
          { cmd: "aws --profile prod --region eu-west-1 s3 ls", desc: "Override profile and region for one command." },
          { cmd: "aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --output table", desc: "JMESPath filter plus a readable table." },
        ],
      },
      {
        title: "Compute & containers",
        commands: [
          { cmd: "aws ec2 describe-instances --filters Name=instance-state-name,Values=running", desc: "Running instances only — filter server-side." },
          { cmd: "aws ssm start-session --target i-x", desc: "Shell in via Session Manager; no key pair, no open port 22." },
          { cmd: "aws lambda get-function-configuration --function-name f", desc: "Memory, timeout, runtime, role, and VPC config." },
          { cmd: "aws ecs update-service --cluster c --service s --force-new-deployment", desc: "Redeploy a service against the same task definition." },
          { cmd: "aws eks update-kubeconfig --name cluster --region eu-west-1", desc: "Write the kubeconfig entry for an EKS cluster." },
        ],
      },
      {
        title: "Storage & permissions",
        commands: [
          { cmd: "aws s3 sync ./dir s3://bucket/prefix --delete", desc: "Mirror a directory into a bucket." },
          { cmd: "aws s3 presign s3://bucket/key --expires-in 3600", desc: "Time-limited URL for someone with no AWS credentials." },
          { cmd: "aws s3api get-public-access-block --bucket b", desc: "Check the four public-access guards." },
          { cmd: "aws iam simulate-principal-policy --policy-source-arn ARN --action-names s3:GetObject --resource-arns ARN", desc: "Prove a permission before you deploy it." },
          { cmd: "aws logs tail /aws/lambda/f --follow", desc: "Live-tail a log group." },
        ],
      },
    ],
  },
  {
    id: "azure",
    tool: "Azure CLI",
    blurb: "Subscriptions, resource groups, and the fact that almost everything is scoped to one.",
    accent: "iris",
    sections: [
      {
        title: "Sign in & scope",
        commands: [
          { cmd: "az login", desc: "Interactive sign-in; opens a browser." },
          { cmd: "az account show --output table", desc: "The active subscription and tenant — the Azure equivalent of get-caller-identity." },
          { cmd: "az account list --output table", desc: "Every subscription you can see." },
          { cmd: "az account set --subscription \"Prod\"", desc: "Switch the active subscription; nearly every mistake starts with skipping this." },
          { cmd: "az group create --name rg-app --location westeurope", desc: "Create a resource group — the container everything else lives in." },
          { cmd: "az group delete --name rg-app --yes", desc: "Delete the group and everything inside it." },
          { cmd: "az configure --defaults group=rg-app location=westeurope", desc: "Stop retyping --resource-group on every command." },
        ],
      },
      {
        title: "Compute & containers",
        commands: [
          { cmd: "az vm list --output table", desc: "VMs in the current subscription." },
          { cmd: "az vm create --resource-group rg --name vm1 --image Ubuntu2204 --generate-ssh-keys", desc: "Create a VM with a generated key pair." },
          { cmd: "az vm deallocate --resource-group rg --name vm1", desc: "Stop *and* release the compute — plain `az vm stop` keeps billing." },
          { cmd: "az aks get-credentials --resource-group rg --name aks1", desc: "Merge an AKS cluster into your kubeconfig." },
          { cmd: "az aks nodepool list --resource-group rg --cluster-name aks1 --output table", desc: "Node pools, sizes, and counts." },
          { cmd: "az acr login --name myregistry", desc: "Authenticate Docker against Azure Container Registry." },
          { cmd: "az acr build --registry myregistry --image app:v1 .", desc: "Build and push in the registry, no local Docker daemon needed." },
        ],
      },
      {
        title: "App hosting & functions",
        commands: [
          { cmd: "az webapp list --output table", desc: "App Service apps and their states." },
          { cmd: "az webapp log tail --name app --resource-group rg", desc: "Live application logs." },
          { cmd: "az webapp deployment slot swap --name app --resource-group rg --slot staging", desc: "Blue/green swap of a deployment slot." },
          { cmd: "az functionapp config appsettings list --name fn --resource-group rg", desc: "Function app settings — the Azure answer to env vars." },
          { cmd: "az containerapp up --name app --resource-group rg --source .", desc: "Build and deploy a Container App from source." },
        ],
      },
      {
        title: "Storage & identity",
        commands: [
          { cmd: "az storage account list --output table", desc: "Storage accounts in scope." },
          { cmd: "az storage blob upload --account-name sa --container-name c --name k --file f", desc: "Upload a blob." },
          { cmd: "az storage blob generate-sas --account-name sa --container-name c --name k --permissions r --expiry 2026-12-31", desc: "SAS token — Azure's presigned URL." },
          { cmd: "az keyvault secret set --vault-name kv --name db-password --value ...", desc: "Store a secret in Key Vault." },
          { cmd: "az keyvault secret show --vault-name kv --name db-password --query value -o tsv", desc: "Read it back for a script." },
          { cmd: "az role assignment list --assignee USER --all --output table", desc: "Every RBAC role a principal holds, and at which scope." },
          { cmd: "az role assignment create --assignee USER --role Reader --scope /subscriptions/ID/resourceGroups/rg", desc: "Grant a role at a scope — RBAC inherits downward." },
          { cmd: "az identity create --name mi --resource-group rg", desc: "Create a managed identity so nothing has to hold a secret." },
        ],
      },
      {
        title: "Deploy & inspect",
        commands: [
          { cmd: "az deployment group create --resource-group rg --template-file main.bicep", desc: "Deploy a Bicep/ARM template into a resource group." },
          { cmd: "az deployment group what-if --resource-group rg --template-file main.bicep", desc: "Preview changes before applying — Azure's terraform plan." },
          { cmd: "az resource list --resource-group rg --output table", desc: "Everything in a group, whatever the type." },
          { cmd: "az monitor activity-log list --resource-group rg --max-events 20", desc: "Who changed what, and when." },
          { cmd: "az monitor metrics list --resource ID --metric \"Percentage CPU\"", desc: "Pull a metric series from Azure Monitor." },
          { cmd: "az consumption usage list --output table", desc: "Usage and spend for the current billing period." },
        ],
      },
    ],
  },
  {
    id: "mapping",
    tool: "AWS ↔ Azure mapping",
    blurb: "The same idea under two names — what to say when an interviewer switches clouds mid-question.",
    accent: "teal",
    sections: [
      {
        title: "Compute",
        commands: [
          { cmd: "EC2", desc: "Azure Virtual Machines — raw VMs you patch and scale yourself." },
          { cmd: "Auto Scaling Group", desc: "Virtual Machine Scale Sets — identical VMs scaled by a rule." },
          { cmd: "Lambda", desc: "Azure Functions — event-driven, per-execution billing." },
          { cmd: "ECS / Fargate", desc: "Azure Container Instances / Container Apps — containers without a cluster to run." },
          { cmd: "EKS", desc: "AKS — managed Kubernetes; the control plane is free on both." },
          { cmd: "Elastic Beanstalk", desc: "App Service — managed application hosting with slots and scaling." },
        ],
      },
      {
        title: "Storage & data",
        commands: [
          { cmd: "S3", desc: "Blob Storage — object storage with tiers and lifecycle rules." },
          { cmd: "EBS", desc: "Managed Disks — block storage attached to one VM." },
          { cmd: "EFS", desc: "Azure Files — shared file system over SMB/NFS." },
          { cmd: "RDS", desc: "Azure SQL Database / Database for PostgreSQL — managed relational engines." },
          { cmd: "DynamoDB", desc: "Cosmos DB — managed NoSQL; Cosmos adds multi-model and global distribution." },
          { cmd: "Redshift", desc: "Synapse Analytics — the analytical warehouse." },
          { cmd: "ElastiCache", desc: "Azure Cache for Redis." },
        ],
      },
      {
        title: "Network, identity & ops",
        commands: [
          { cmd: "VPC", desc: "Virtual Network (VNet) — the private address space." },
          { cmd: "Security Group", desc: "Network Security Group (NSG) — stateful rules, but NSGs attach to subnets or NICs." },
          { cmd: "ALB / NLB", desc: "Application Gateway / Load Balancer — layer 7 and layer 4 respectively." },
          { cmd: "Route 53", desc: "Azure DNS + Traffic Manager." },
          { cmd: "CloudFront", desc: "Azure Front Door / CDN." },
          { cmd: "IAM", desc: "Microsoft Entra ID + Azure RBAC — identity and authorization are two services, not one." },
          { cmd: "Secrets Manager / KMS", desc: "Key Vault — secrets, keys, and certificates in one service." },
          { cmd: "CloudWatch", desc: "Azure Monitor (+ Log Analytics for queries)." },
          { cmd: "CloudTrail", desc: "Activity Log — the audit trail of control-plane changes." },
          { cmd: "CloudFormation", desc: "ARM templates / Bicep — the native IaC language." },
          { cmd: "Organizations / OU", desc: "Management Groups — the hierarchy above subscriptions." },
        ],
      },
    ],
  },
];
