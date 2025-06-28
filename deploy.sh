#!/bin/bash

# TaskManager Pro - Automated AWS Deployment Script
# This script deploys the entire application to AWS automatically

set -e

echo "🚀 TaskManager Pro - Automated AWS Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install it first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install it first."
    exit 1
fi

print_success "All prerequisites are installed"

# Check AWS credentials
print_status "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials are not configured."
    echo "Please run: aws configure"
    exit 1
fi

print_success "AWS credentials are configured"

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Setup AWS environment
print_status "Setting up AWS environment..."
npm run setup:aws
print_success "AWS environment setup complete"

# Deploy infrastructure and application
print_status "Deploying to AWS..."
npm run deploy:aws

print_success "🎉 Deployment completed successfully!"

echo ""
echo "📋 Next Steps:"
echo "1. Check the CloudFront URL provided above"
echo "2. Verify email addresses in AWS SES Console for notifications"
echo "3. Test the application with demo credentials"
echo ""
echo "🔗 Useful AWS Console Links:"
echo "- CloudFront: https://console.aws.amazon.com/cloudfront/"
echo "- S3: https://console.aws.amazon.com/s3/"
echo "- Lambda: https://console.aws.amazon.com/lambda/"
echo "- DynamoDB: https://console.aws.amazon.com/dynamodb/"
echo "- Cognito: https://console.aws.amazon.com/cognito/"
echo ""
print_success "TaskManager Pro is now live on AWS! 🚀"