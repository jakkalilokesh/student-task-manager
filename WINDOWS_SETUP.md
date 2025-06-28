# 🪟 Windows Setup Guide for TaskManager Pro

## 📋 **Step-by-Step Installation Guide**

### **Step 1: Install AWS CLI**

#### **Option A: Using MSI Installer (Recommended)**
1. **Download AWS CLI:**
   - Go to: https://aws.amazon.com/cli/
   - Click "Download AWS CLI for Windows"
   - Download the MSI installer

2. **Install AWS CLI:**
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - Restart PowerShell/Command Prompt

#### **Option B: Using PowerShell (Alternative)**
```powershell
# Run PowerShell as Administrator
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

#### **Verify Installation:**
```powershell
aws --version
# Should show: aws-cli/2.x.x Python/3.x.x Windows/10 exe/AMD64
```

### **Step 2: Configure AWS Credentials**

1. **Get AWS Credentials:**
   - Log into AWS Console: https://console.aws.amazon.com/
   - Go to IAM → Users → Your User → Security Credentials
   - Create Access Key (if you don't have one)
   - **Save the Access Key ID and Secret Access Key**

2. **Configure AWS CLI:**
   ```powershell
   aws configure
   ```
   
   **Enter the following when prompted:**
   ```
   AWS Access Key ID: [Your Access Key ID]
   AWS Secret Access Key: [Your Secret Access Key]
   Default region name: us-east-1
   Default output format: json
   ```

3. **Test Configuration:**
   ```powershell
   aws sts get-caller-identity
   ```
   Should return your AWS account information.

### **Step 3: Install Node.js (if not installed)**

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download LTS version (18.x or higher)
   - Install with default settings

2. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```

### **Step 4: Prepare Deployment Script for Windows**

Since you're on Windows, we need to use PowerShell instead of bash:

```powershell
# Navigate to your project directory
cd "C:\Users\Jakkali Lokesh\Desktop\task\student-employee-task-manager"

# Install dependencies
npm install

# Run the deployment
npm run deploy:aws
```

### **Step 5: Alternative - Manual Deployment Commands**

If the shell script doesn't work, run these commands one by one:

```powershell
# 1. Install dependencies
npm install

# 2. Setup AWS environment
npm run setup:aws

# 3. Deploy infrastructure
cd infrastructure
npm install
npx cdk bootstrap
npx cdk deploy --all --require-approval never --outputs-file ../cdk-outputs.json
cd ..

# 4. Build and deploy frontend
npm run build
# Get bucket name from cdk-outputs.json and replace below
aws s3 sync dist/ s3://YOUR-BUCKET-NAME --delete
```

## 🚀 **Quick Start Commands**

Once AWS CLI is installed and configured:

```powershell
# Navigate to project
cd "C:\Users\Jakkali Lokesh\Desktop\task\student-employee-task-manager"

# One-command deployment
npm run deploy:aws
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"aws is not recognized"**
   - Restart PowerShell after installing AWS CLI
   - Add AWS CLI to PATH manually if needed

2. **"Access Denied" errors**
   - Ensure your AWS user has sufficient permissions
   - Attach `AdministratorAccess` policy for deployment

3. **CDK Bootstrap issues**
   - Run: `npx cdk bootstrap` manually
   - Ensure you have permissions to create CloudFormation stacks

### **Required AWS Permissions:**
Your AWS user needs these permissions:
- CloudFormation (full access)
- S3 (full access)
- Lambda (full access)
- API Gateway (full access)
- DynamoDB (full access)
- Cognito (full access)
- CloudFront (full access)
- SES (full access)
- SNS (full access)
- IAM (full access)

## 📊 **Expected Timeline:**
- **AWS CLI Installation:** 2-3 minutes
- **Configuration:** 2-3 minutes
- **Deployment:** 10-15 minutes
- **Total:** ~20 minutes

## 🎉 **After Successful Deployment:**

You'll see output like:
```
🎉 Deployment completed successfully!

📋 Deployment Information:
Frontend URL: https://d1234567890.cloudfront.net
API Endpoint: https://abcdef123.execute-api.us-east-1.amazonaws.com/prod
User Pool ID: us-east-1_ABC123DEF
```

## 🆘 **Need Help?**

If you encounter issues:
1. Check AWS CLI installation: `aws --version`
2. Check credentials: `aws sts get-caller-identity`
3. Check Node.js: `node --version`
4. Ensure you're in the correct directory
5. Check AWS permissions in IAM console

**Your TaskManager Pro will be live on AWS after following these steps!** 🚀