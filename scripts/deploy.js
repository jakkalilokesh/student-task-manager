import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora();

async function deploy() {
  console.log(chalk.blue.bold('🚀 Deploying TaskManager Pro to AWS\n'));

  try {
    // Step 1: Deploy infrastructure
    spinner.start('Deploying AWS infrastructure...');
    const cdkOutput = execSync('cd infrastructure && npx cdk deploy --all --require-approval never --outputs-file ../cdk-outputs.json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    spinner.succeed('Infrastructure deployed successfully');

    // Step 2: Read CDK outputs
    spinner.start('Reading deployment outputs...');
    const outputs = JSON.parse(readFileSync('cdk-outputs.json', 'utf8'));
    const stackOutputs = outputs.TaskManagerStack;
    
    // Step 3: Create environment file
    const envContent = `VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=${stackOutputs.UserPoolId}
VITE_AWS_USER_POOL_CLIENT_ID=${stackOutputs.UserPoolClientId}
VITE_AWS_IDENTITY_POOL_ID=${stackOutputs.IdentityPoolId}
VITE_API_ENDPOINT=${stackOutputs.ApiEndpoint}
VITE_S3_BUCKET=${stackOutputs.FilesBucketName}
VITE_CLOUDFRONT_URL=https://${stackOutputs.CloudFrontURL}
`;

    writeFileSync('.env.production', envContent);
    spinner.succeed('Environment configuration created');

    // Step 4: Build frontend
    spinner.start('Building frontend application...');
    execSync('npm run build', { stdio: 'pipe' });
    spinner.succeed('Frontend built successfully');

    // Step 5: Deploy to S3
    spinner.start('Deploying frontend to S3...');
    execSync(`aws s3 sync dist/ s3://${stackOutputs.FrontendBucketName} --delete`, { stdio: 'pipe' });
    spinner.succeed('Frontend deployed to S3');

    // Step 6: Invalidate CloudFront cache
    spinner.start('Invalidating CloudFront cache...');
    try {
      const distributionId = execSync(`aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='TaskManager Pro Distribution'].Id" --output text`, { encoding: 'utf8' }).trim();
      if (distributionId) {
        execSync(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`, { stdio: 'pipe' });
        spinner.succeed('CloudFront cache invalidated');
      } else {
        spinner.warn('CloudFront distribution not found for cache invalidation');
      }
    } catch (error) {
      spinner.warn('Could not invalidate CloudFront cache');
    }

    console.log(chalk.green.bold('\n🎉 Deployment completed successfully!\n'));
    
    console.log(chalk.blue.bold('📋 Deployment Information:'));
    console.log(chalk.white(`Frontend URL: https://${stackOutputs.CloudFrontURL}`));
    console.log(chalk.white(`API Endpoint: ${stackOutputs.ApiEndpoint}`));
    console.log(chalk.white(`User Pool ID: ${stackOutputs.UserPoolId}`));
    console.log(chalk.white(`S3 Bucket: ${stackOutputs.FrontendBucketName}`));
    
    console.log(chalk.yellow.bold('\n⚠️  Important Notes:'));
    console.log(chalk.white('1. CloudFront deployment may take 10-15 minutes to propagate globally'));
    console.log(chalk.white('2. SES is in sandbox mode - verify email addresses in AWS Console'));
    console.log(chalk.white('3. Demo credentials are available on the login page'));
    
    console.log(chalk.green.bold('\n✅ Your TaskManager Pro is now live!'));

  } catch (error) {
    spinner.fail('Deployment failed');
    console.error(chalk.red('Error:', error.message));
    console.log(chalk.yellow('\nTroubleshooting:'));
    console.log(chalk.white('1. Check AWS credentials: aws sts get-caller-identity'));
    console.log(chalk.white('2. Ensure CDK is bootstrapped: npx cdk bootstrap'));
    console.log(chalk.white('3. Check AWS permissions for CDK deployment'));
    process.exit(1);
  }
}

deploy();