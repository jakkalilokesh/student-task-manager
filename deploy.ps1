# TaskManager Pro - Windows PowerShell Deployment Script
# Run this script in PowerShell to deploy to AWS

param(
    [switch]$SkipPrerequisites = $false
)

Write-Host "🚀 TaskManager Pro - Windows AWS Deployment" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check prerequisites
if (-not $SkipPrerequisites) {
    Write-Status "Checking prerequisites..."

    # Check AWS CLI
    try {
        $awsVersion = aws --version 2>$null
        Write-Success "AWS CLI is installed: $awsVersion"
    }
    catch {
        Write-Error "AWS CLI is not installed."
        Write-Host "Please install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
        Write-Host "Then run: aws configure" -ForegroundColor Yellow
        exit 1
    }

    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        Write-Success "Node.js is installed: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed."
        Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }

    # Check AWS credentials
    Write-Status "Checking AWS credentials..."
    try {
        $identity = aws sts get-caller-identity 2>$null
        Write-Success "AWS credentials are configured"
    }
    catch {
        Write-Error "AWS credentials are not configured."
        Write-Host "Please run: aws configure" -ForegroundColor Yellow
        exit 1
    }
}

try {
    # Install dependencies
    Write-Status "Installing dependencies..."
    npm install
    Write-Success "Dependencies installed"

    # Setup AWS environment
    Write-Status "Setting up AWS environment..."
    npm run setup:aws
    Write-Success "AWS environment setup complete"

    # Deploy to AWS
    Write-Status "Deploying to AWS..."
    npm run deploy:aws
    
    Write-Success "🎉 Deployment completed successfully!"
    
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Blue
    Write-Host "1. Check the CloudFront URL provided above"
    Write-Host "2. Verify email addresses in AWS SES Console for notifications"
    Write-Host "3. Test the application with demo credentials"
    Write-Host ""
    Write-Host "🔗 Useful AWS Console Links:" -ForegroundColor Blue
    Write-Host "- CloudFront: https://console.aws.amazon.com/cloudfront/"
    Write-Host "- S3: https://console.aws.amazon.com/s3/"
    Write-Host "- Lambda: https://console.aws.amazon.com/lambda/"
    Write-Host "- DynamoDB: https://console.aws.amazon.com/dynamodb/"
    Write-Host "- Cognito: https://console.aws.amazon.com/cognito/"
    Write-Host ""
    Write-Success "TaskManager Pro is now live on AWS! 🚀"
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check AWS credentials: aws sts get-caller-identity"
    Write-Host "2. Ensure CDK is bootstrapped: npx cdk bootstrap"
    Write-Host "3. Check AWS permissions for CDK deployment"
    Write-Host "4. Try running: npm run setup:aws"
    exit 1
}