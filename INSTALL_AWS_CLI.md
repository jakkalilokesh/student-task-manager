# 🪟 **AWS CLI Installation for Windows - Step by Step**

## **Method 1: Download and Install (Recommended)**

### **Step 1: Download AWS CLI**
1. **Open your web browser**
2. **Go to:** https://aws.amazon.com/cli/
3. **Click:** "Download AWS CLI for Windows"
4. **Download:** `AWSCLIV2.msi` file

### **Step 2: Install AWS CLI**
1. **Double-click** the downloaded `AWSCLIV2.msi` file
2. **Follow the installation wizard** (click Next, Next, Install)
3. **Wait for installation** to complete
4. **Click Finish**

### **Step 3: Restart PowerShell**
1. **Close** all PowerShell/Command Prompt windows
2. **Open PowerShell again** (Right-click Start → Windows PowerShell)

### **Step 4: Verify Installation**
```powershell
aws --version
```
You should see something like: `aws-cli/2.x.x Python/3.x.x Windows/10 exe/AMD64`

---

## **Method 2: PowerShell Installation (Alternative)**

If the download doesn't work, try this:

```powershell
# Run PowerShell as Administrator
# Right-click Start → Windows PowerShell (Admin)

# Install using PowerShell
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"
Start-Process msiexec.exe -Wait -ArgumentList '/I AWSCLIV2.msi /quiet'
Remove-Item "AWSCLIV2.msi"
```

---

## **Step 5: Configure AWS Credentials**

After AWS CLI is installed:

### **Get AWS Credentials:**
1. **Log into AWS Console:** https://console.aws.amazon.com/
2. **Go to:** IAM → Users → Your Username → Security Credentials
3. **Click:** "Create Access Key"
4. **Copy:** Access Key ID and Secret Access Key

### **Configure AWS CLI:**
```powershell
aws configure
```

**Enter when prompted:**
```
AWS Access Key ID: [Paste your Access Key ID]
AWS Secret Access Key: [Paste your Secret Access Key]
Default region name: us-east-1
Default output format: json
```

### **Test Configuration:**
```powershell
aws sts get-caller-identity
```

---

## **Step 6: Deploy TaskManager Pro**

Once AWS CLI is working:

```powershell
# Navigate to your project
cd "C:\Users\Jakkali Lokesh\Desktop\task\student-employee-task-manager"

# Install dependencies
npm install

# Deploy everything to AWS
npm run deploy:aws
```

---

## **🚨 If You Don't Have AWS Account:**

1. **Create AWS Account:** https://aws.amazon.com/
2. **Verify your email and phone**
3. **Add payment method** (free tier available)
4. **Create IAM user** with AdministratorAccess policy
5. **Get Access Keys** from that user

---

## **🔧 Troubleshooting:**

### **"aws is not recognized" after installation:**
1. **Restart PowerShell completely**
2. **Check if AWS CLI is in PATH:**
   ```powershell
   $env:PATH -split ';' | Select-String -Pattern 'aws'
   ```
3. **Manually add to PATH if needed:**
   ```powershell
   $env:PATH += ";C:\Program Files\Amazon\AWSCLIV2\"
   ```

### **Installation fails:**
1. **Run PowerShell as Administrator**
2. **Disable antivirus temporarily**
3. **Try Method 2 (PowerShell installation)**

---

## **✅ Success Indicators:**

You'll know it's working when:
1. `aws --version` shows version info
2. `aws sts get-caller-identity` shows your AWS account info
3. No "command not found" errors

**Once AWS CLI is installed and configured, the deployment will work perfectly!** 🚀