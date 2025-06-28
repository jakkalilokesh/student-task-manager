# TaskManager Pro - Student & Employee Task Management System

A comprehensive, production-ready task management application built with React, TypeScript, and integrated with multiple AWS services for scalability, security, and performance.

## 🚀 **One-Click AWS Deployment**

### **Quick Start (Automated Deployment)**

```bash
# Clone the repository
git clone <repository-url>
cd student-employee-task-manager

# Make deployment script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh
```

**That's it! The script will:**
- ✅ Check all prerequisites
- ✅ Install dependencies
- ✅ Setup AWS environment
- ✅ Deploy all AWS services
- ✅ Build and deploy frontend
- ✅ Configure everything automatically

### **Manual Deployment (Step by Step)**

If you prefer manual control:

```bash
# 1. Install dependencies
npm install

# 2. Setup AWS environment
npm run setup:aws

# 3. Deploy everything to AWS
npm run deploy:aws

# 4. Or deploy just frontend after changes
npm run deploy:frontend
```

## 🏗 **AWS Architecture (Auto-Deployed)**

### **Services Automatically Created:**
1. **Amazon Cognito** - User authentication with email/SMS OTP
2. **DynamoDB** - NoSQL database for all data storage
3. **AWS Lambda** - Serverless backend functions
4. **API Gateway** - RESTful API management
5. **Amazon S3** - Static website hosting & file storage
6. **CloudFront** - Global CDN for fast delivery
7. **Amazon SES** - Email notification service
8. **Amazon SNS** - SMS notification service
9. **EventBridge** - Scheduled task reminders
10. **IAM** - Security and access management

### **Architecture Diagram:**
```
Internet → CloudFront → S3 (Frontend)
    ↓
API Gateway → Lambda Functions → DynamoDB
    ↓
SES (Email) + SNS (SMS) + EventBridge (Scheduling)
```

## 🎯 **Features**

### **Core Functionality**
- ✅ **Dual User Types**: Student & Employee interfaces
- ✅ **Smart Task Management**: Create, organize, prioritize tasks
- ✅ **Project Management**: Full project lifecycle management
- ✅ **Calendar Integration**: Event scheduling and management
- ✅ **Real-time Notifications**: Email & SMS reminders
- ✅ **Analytics Dashboard**: Productivity insights
- ✅ **Dark/Light Theme**: Fully functional theme switching
- ✅ **File Attachments**: S3-powered file storage
- ✅ **Responsive Design**: Mobile, tablet, desktop optimized

### **AWS Integration**
- ✅ **Cognito Authentication**: Email/Mobile OTP verification
- ✅ **DynamoDB Storage**: Scalable data persistence
- ✅ **Lambda Backend**: Serverless API processing
- ✅ **S3 File Storage**: Secure file management
- ✅ **SES Email**: Automated email notifications
- ✅ **SNS SMS**: SMS reminder system
- ✅ **EventBridge**: Scheduled task reminders
- ✅ **CloudFront CDN**: Global content delivery

## 🔧 **Technology Stack**

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast
- **AWS SDK**: AWS Amplify
- **Infrastructure**: AWS CDK (TypeScript)

## 📦 **Project Structure**

```
student-employee-task-manager/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   ├── store/                   # State management
│   ├── services/               # AWS service integrations
│   └── types/                  # TypeScript definitions
├── infrastructure/             # AWS CDK infrastructure code
│   ├── lib/                   # CDK stack definitions
│   └── bin/                   # CDK app entry point
├── scripts/                   # Deployment scripts
├── docs/                      # Documentation
└── deploy.sh                  # One-click deployment script
```

## 🎮 **Demo Credentials**

### **Student Account**
- **Email**: `student.demo@taskmanager.com`
- **Password**: `StudentDemo123!`

### **Employee Account**
- **Email**: `employee.demo@taskmanager.com`
- **Password**: `EmployeeDemo123!`

## 💰 **AWS Cost Estimation**

### **Monthly Costs (Production)**
- **Lambda**: $5-20 (based on usage)
- **DynamoDB**: $10-50 (based on data size)
- **S3**: $5-15 (storage and requests)
- **CloudFront**: $5-20 (data transfer)
- **API Gateway**: $3-10 (API calls)
- **SES**: $1-5 (emails sent)
- **SNS**: $1-3 (SMS messages)
- **Cognito**: $0-10 (active users)

**Total Estimated: $30-133/month**

## 🔒 **Security Features**

- ✅ **Multi-Factor Authentication** via Cognito
- ✅ **Role-Based Access Control**
- ✅ **Data Encryption** at rest and in transit
- ✅ **API Rate Limiting** and input validation
- ✅ **Secure File Upload** with virus scanning
- ✅ **HTTPS Everywhere** via CloudFront

## 📊 **Monitoring & Analytics**

- ✅ **CloudWatch**: Application and infrastructure monitoring
- ✅ **X-Ray**: Distributed tracing for performance
- ✅ **Custom Metrics**: Task completion rates, user engagement
- ✅ **Cost Monitoring**: AWS Cost Explorer integration

## 🚀 **Deployment Outputs**

After successful deployment, you'll receive:

```
🎉 Deployment completed successfully!

📋 Deployment Information:
Frontend URL: https://d1234567890.cloudfront.net
API Endpoint: https://abcdef123.execute-api.us-east-1.amazonaws.com/prod
User Pool ID: us-east-1_ABC123DEF
S3 Bucket: taskmanager-frontend-123456789

⚠️  Important Notes:
1. CloudFront deployment may take 10-15 minutes to propagate globally
2. SES is in sandbox mode - verify email addresses in AWS Console
3. Demo credentials are available on the login page

✅ Your TaskManager Pro is now live!
```

## 🛠 **Development**

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **AWS Development**
```bash
# Deploy infrastructure only
npm run cdk:deploy

# Deploy frontend only
npm run deploy:frontend

# Destroy all AWS resources
npm run cdk:destroy
```

## 📚 **Documentation**

- [AWS Architecture Guide](./docs/AWS_ARCHITECTURE.md)
- [Complete Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [API Documentation](./docs/api.md)
- [User Manual](./docs/user-guide.md)

## 🤝 **Support**

For support and questions:
- **Email**: support@taskmanagerpro.com
- **Documentation**: [docs.taskmanagerpro.com](https://docs.taskmanagerpro.com)
- **Issues**: GitHub Issues tab

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and AWS Services**

🚀 **Ready for production deployment with one command!**