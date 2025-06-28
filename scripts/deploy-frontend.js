import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora();

async function deployFrontend() {
  console.log(chalk.blue.bold('🚀 Deploying Frontend to AWS S3\n'));

  try {
    // Read CDK outputs
    spinner.start('Reading deployment configuration...');
    const outputs = JSON.parse(readFileSync('cdk-outputs.json', 'utf8'));
    const stackOutputs = outputs.TaskManagerStack;
    spinner.succeed('Configuration loaded');

    // Build frontend
    spinner.start('Building frontend application...');
    execSync('npm run build', { stdio: 'pipe' });
    spinner.succeed('Frontend built successfully');

    // Deploy to S3
    spinner.start('Uploading to S3...');
    execSync(`aws s3 sync dist/ s3://${stackOutputs.FrontendBucketName} --delete`, { stdio: 'pipe' });
    spinner.succeed('Frontend uploaded to S3');

    // Invalidate CloudFront cache
    spinner.start('Invalidating CloudFront cache...');
    try {
      const distributionId = execSync(`aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='TaskManager Pro Distribution'].Id" --output text`, { encoding: 'utf8' }).trim();
      if (distributionId) {
        execSync(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`, { stdio: 'pipe' });
        spinner.succeed('CloudFront cache invalidated');
      }
    } catch (error) {
      spinner.warn('Could not invalidate CloudFront cache');
    }

    console.log(chalk.green.bold('\n✅ Frontend deployment completed!'));
    console.log(chalk.white(`URL: https://${stackOutputs.CloudFrontURL}`));

  } catch (error) {
    spinner.fail('Frontend deployment failed');
    console.error(chalk.red('Error:', error.message));
    process.exit(1);
  }
}

deployFrontend();