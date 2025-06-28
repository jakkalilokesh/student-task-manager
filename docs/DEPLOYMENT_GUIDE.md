# Complete AWS Deployment Guide

## Prerequisites

### Required Tools
- AWS CLI v2.x
- Node.js 18+
- npm or yarn
- Git

### AWS Account Setup
1. Create AWS account with billing enabled
2. Create IAM user with programmatic access
3. Attach necessary policies (see IAM Policies section)
4. Configure AWS CLI: `aws configure`

## Phase 1: Core Infrastructure Setup

### 1. Create S3 Buckets
```bash
# Main application bucket
aws s3 mb s3://taskmanager-app-prod --region us-east-1

# File attachments bucket
aws s3 mb s3://taskmanager-files-prod --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket taskmanager-app-prod \
  --versioning-configuration Status=Enabled

# Configure CORS for file uploads
cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket taskmanager-files-prod \
  --cors-configuration file://cors-config.json
```

### 2. Setup DynamoDB Tables
```bash
# Users table
aws dynamodb create-table \
  --table-name TaskManager-Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tasks table
aws dynamodb create-table \
  --table-name TaskManager-Tasks \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=taskId,AttributeType=S \
    AttributeName=status,AttributeType=S \
    AttributeName=dueDate,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=taskId,KeyType=RANGE \
  --global-secondary-indexes \
    IndexName=StatusIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=status,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    IndexName=DueDateIndex,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=dueDate,KeyType=RANGE}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Notifications table
aws dynamodb create-table \
  --table-name TaskManager-Notifications \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=notificationId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=notificationId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. Setup Cognito User Pool
```bash
# Create user pool
aws cognito-idp create-user-pool \
  --pool-name TaskManagerUserPool \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --auto-verified-attributes email phone_number \
  --mfa-configuration OPTIONAL \
  --device-configuration '{
    "ChallengeRequiredOnNewDevice": true,
    "DeviceOnlyRememberedOnUserPrompt": false
  }' \
  --email-configuration '{
    "EmailSendingAccount": "COGNITO_DEFAULT"
  }' \
  --sms-configuration '{
    "SnsCallerArn": "arn:aws:iam::ACCOUNT-ID:role/service-role/CognitoSNSRole"
  }' \
  --region us-east-1

# Create user pool client
aws cognito-idp create-user-pool-client \
  --user-pool-id <USER_POOL_ID> \
  --client-name TaskManagerClient \
  --generate-secret false \
  --supported-identity-providers COGNITO \
  --callback-urls https://taskmanager-app-prod.s3-website-us-east-1.amazonaws.com \
  --logout-urls https://taskmanager-app-prod.s3-website-us-east-1.amazonaws.com \
  --allowed-o-auth-flows code implicit \
  --allowed-o-auth-scopes email openid profile \
  --allowed-o-auth-flows-user-pool-client \
  --region us-east-1

# Create identity pool
aws cognito-identity create-identity-pool \
  --identity-pool-name TaskManagerIdentityPool \
  --allow-unauthenticated-identities false \
  --cognito-identity-providers ProviderName=cognito-idp.us-east-1.amazonaws.com/<USER_POOL_ID>,ClientId=<CLIENT_ID>,ServerSideTokenCheck=false \
  --region us-east-1
```

## Phase 2: Lambda Functions Deployment

### 1. Create IAM Role for Lambda
```bash
# Create trust policy
cat > lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name TaskManagerLambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name TaskManagerLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name TaskManagerLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
  --role-name TaskManagerLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name TaskManagerLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

aws iam attach-role-policy \
  --role-name TaskManagerLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess
```

### 2. Deploy Lambda Functions
```bash
# Create deployment package
mkdir lambda-functions && cd lambda-functions

# Task management function
cat > task-handler.js << EOF
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { httpMethod, pathParameters, body } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        return await getTasks(pathParameters.userId);
      case 'POST':
        return await createTask(JSON.parse(body));
      case 'PUT':
        return await updateTask(pathParameters.taskId, JSON.parse(body));
      case 'DELETE':
        return await deleteTask(pathParameters.taskId);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function getTasks(userId) {
  const params = {
    TableName: 'TaskManager-Tasks',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  
  const result = await dynamodb.query(params).promise();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(result.Items)
  };
}

async function createTask(task) {
  const params = {
    TableName: 'TaskManager-Tasks',
    Item: {
      ...task,
      taskId: AWS.util.uuid.v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  
  await dynamodb.put(params).promise();
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(params.Item)
  };
}

async function updateTask(taskId, updates) {
  const params = {
    TableName: 'TaskManager-Tasks',
    Key: { taskId },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': updates.status,
      ':updatedAt': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await dynamodb.update(params).promise();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(result.Attributes)
  };
}

async function deleteTask(taskId) {
  const params = {
    TableName: 'TaskManager-Tasks',
    Key: { taskId }
  };
  
  await dynamodb.delete(params).promise();
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
  };
}
EOF

# Package and deploy
zip task-handler.zip task-handler.js

aws lambda create-function \
  --function-name TaskManagerTaskHandler \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT-ID:role/TaskManagerLambdaRole \
  --handler task-handler.handler \
  --zip-file fileb://task-handler.zip \
  --timeout 30 \
  --memory-size 256 \
  --region us-east-1
```

### 3. Setup API Gateway
```bash
# Create REST API
aws apigateway create-rest-api \
  --name TaskManagerAPI \
  --description "Task Manager REST API" \
  --region us-east-1

# Get API ID and root resource ID
API_ID=$(aws apigateway get-rest-apis --query 'items[?name==`TaskManagerAPI`].id' --output text)
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text)

# Create resources and methods
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part tasks

# Configure CORS
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --authorization-type NONE

# Deploy API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod
```

## Phase 3: Frontend Deployment

### 1. Build and Deploy React App
```bash
# Clone repository
git clone <repository-url>
cd student-employee-task-manager

# Install dependencies
npm install

# Create production environment file
cat > .env.production << EOF
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=<USER_POOL_ID>
VITE_AWS_USER_POOL_CLIENT_ID=<CLIENT_ID>
VITE_AWS_IDENTITY_POOL_ID=<IDENTITY_POOL_ID>
VITE_API_ENDPOINT=https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod
VITE_S3_BUCKET=taskmanager-files-prod
EOF

# Build application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://taskmanager-app-prod --delete

# Configure S3 for static website hosting
aws s3 website s3://taskmanager-app-prod \
  --index-document index.html \
  --error-document index.html
```

### 2. Setup CloudFront Distribution
```bash
# Create CloudFront distribution
cat > cloudfront-config.json << EOF
{
  "CallerReference": "taskmanager-$(date +%s)",
  "Comment": "TaskManager Pro CDN",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-taskmanager-app-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-taskmanager-app-prod",
        "DomainName": "taskmanager-app-prod.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Phase 4: Notification Services

### 1. Setup SES for Email
```bash
# Verify email domain
aws ses verify-domain-identity --domain yourdomain.com

# Create email template
aws ses create-template \
  --template '{
    "TemplateName": "TaskReminder",
    "Subject": "Task Reminder: {{taskTitle}}",
    "HtmlPart": "<h1>Task Reminder</h1><p>Your task \"{{taskTitle}}\" is due on {{dueDate}}.</p>",
    "TextPart": "Task Reminder: Your task \"{{taskTitle}}\" is due on {{dueDate}}."
  }'
```

### 2. Setup SNS for SMS
```bash
# Create SNS topic
aws sns create-topic --name TaskManagerNotifications

# Subscribe to topic (for testing)
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT-ID:TaskManagerNotifications \
  --protocol email \
  --notification-endpoint your-email@example.com
```

## Phase 5: Monitoring and Logging

### 1. Setup CloudWatch
```bash
# Create log groups
aws logs create-log-group --log-group-name /aws/lambda/TaskManagerTaskHandler
aws logs create-log-group --log-group-name /aws/apigateway/TaskManagerAPI

# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name TaskManagerDashboard \
  --dashboard-body file://dashboard-config.json
```

### 2. Setup Alarms
```bash
# Lambda error alarm
aws cloudwatch put-metric-alarm \
  --alarm-name TaskManagerLambdaErrors \
  --alarm-description "Lambda function errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=TaskManagerTaskHandler \
  --evaluation-periods 2

# API Gateway 4xx errors
aws cloudwatch put-metric-alarm \
  --alarm-name TaskManagerAPI4xxErrors \
  --alarm-description "API Gateway 4xx errors" \
  --metric-name 4XXError \
  --namespace AWS/ApiGateway \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ApiName,Value=TaskManagerAPI \
  --evaluation-periods 2
```

## Phase 6: Security Hardening

### 1. Update IAM Policies
```bash
# Create custom policy for least privilege
cat > taskmanager-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:ACCOUNT-ID:table/TaskManager-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::taskmanager-files-prod/*"
      ]
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name TaskManagerCustomPolicy \
  --policy-document file://taskmanager-policy.json
```

### 2. Enable AWS Config
```bash
# Enable Config for compliance monitoring
aws configservice put-configuration-recorder \
  --configuration-recorder name=TaskManagerConfigRecorder,roleARN=arn:aws:iam::ACCOUNT-ID:role/aws-config-role

aws configservice put-delivery-channel \
  --delivery-channel name=TaskManagerDeliveryChannel,s3BucketName=taskmanager-config-bucket
```

## Phase 7: Testing and Validation

### 1. API Testing
```bash
# Test API endpoints
curl -X GET https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/tasks \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Test CORS
curl -X OPTIONS https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/tasks \
  -H "Origin: https://<CLOUDFRONT_DOMAIN>" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization"
```

### 2. Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Get tasks"
    requests:
      - get:
          url: "/tasks"
          headers:
            Authorization: "Bearer <JWT_TOKEN>"
EOF

# Run load test
artillery run load-test.yml
```

## Phase 8: Backup and Disaster Recovery

### 1. Enable DynamoDB Backups
```bash
# Enable point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name TaskManager-Tasks \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

aws dynamodb update-continuous-backups \
  --table-name TaskManager-Users \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

### 2. S3 Cross-Region Replication
```bash
# Create replication configuration
cat > replication-config.json << EOF
{
  "Role": "arn:aws:iam::ACCOUNT-ID:role/replication-role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "Filter": {"Prefix": ""},
      "Destination": {
        "Bucket": "arn:aws:s3:::taskmanager-backup-bucket",
        "StorageClass": "STANDARD_IA"
      }
    }
  ]
}
EOF

aws s3api put-bucket-replication \
  --bucket taskmanager-files-prod \
  --replication-configuration file://replication-config.json
```

## Final Steps

### 1. Update DNS (Optional)
```bash
# Create Route 53 hosted zone
aws route53 create-hosted-zone \
  --name taskmanager.yourdomain.com \
  --caller-reference $(date +%s)

# Create CNAME record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id <ZONE_ID> \
  --change-batch file://dns-change.json
```

### 2. SSL Certificate (Optional)
```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name taskmanager.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### 3. Final Validation
1. Test user registration and login
2. Verify task CRUD operations
3. Test file upload functionality
4. Confirm email/SMS notifications
5. Check monitoring dashboards
6. Validate backup procedures

## Cost Estimation

### Monthly Costs (Estimated)
- **Lambda**: $5-20 (based on usage)
- **DynamoDB**: $10-50 (based on data size)
- **S3**: $5-15 (storage and requests)
- **CloudFront**: $5-20 (data transfer)
- **API Gateway**: $3-10 (API calls)
- **SES**: $1-5 (emails sent)
- **SNS**: $1-3 (SMS messages)
- **Cognito**: $0-10 (active users)

**Total Estimated Monthly Cost: $30-133**

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure API Gateway has proper CORS configuration
2. **Lambda Timeouts**: Increase timeout and memory allocation
3. **DynamoDB Throttling**: Enable auto-scaling or increase capacity
4. **S3 Access Denied**: Check bucket policies and IAM permissions
5. **Cognito Authentication**: Verify user pool and client configuration

### Monitoring Commands
```bash
# Check Lambda logs
aws logs tail /aws/lambda/TaskManagerTaskHandler --follow

# Monitor API Gateway
aws logs tail /aws/apigateway/TaskManagerAPI --follow

# Check DynamoDB metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/DynamoDB \
  --metric-name ConsumedReadCapacityUnits \
  --dimensions Name=TableName,Value=TaskManager-Tasks \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

This deployment guide provides a complete step-by-step process for deploying the TaskManager Pro application to AWS with all necessary services configured for production use.