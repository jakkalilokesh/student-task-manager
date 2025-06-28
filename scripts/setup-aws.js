import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora();

async function setupAWS() {
  console.log(chalk.blue.bold('🚀 Setting up AWS environment for TaskManager Pro\n'));

  try {
    // Check if AWS CLI is installed
    spinner.start('Checking AWS CLI installation...');
    try {
      execSync('aws --version', { stdio: 'pipe' });
      spinner.succeed('AWS CLI is installed');
    } catch (error) {
      spinner.fail('AWS CLI not found');
      console.log(chalk.yellow('Please install AWS CLI: https://aws.amazon.com/cli/'));
      process.exit(1);
    }

    // Check if AWS credentials are configured
    spinner.start('Checking AWS credentials...');
    try {
      execSync('aws sts get-caller-identity', { stdio: 'pipe' });
      spinner.succeed('AWS credentials are configured');
    } catch (error) {
      spinner.fail('AWS credentials not configured');
      console.log(chalk.yellow('Please run: aws configure'));
      process.exit(1);
    }

    // Check if CDK is installed
    spinner.start('Checking AWS CDK installation...');
    try {
      execSync('npx cdk --version', { stdio: 'pipe' });
      spinner.succeed('AWS CDK is available');
    } catch (error) {
      spinner.fail('AWS CDK not found');
      console.log(chalk.yellow('Installing AWS CDK...'));
      execSync('npm install -g aws-cdk', { stdio: 'inherit' });
    }

    // Bootstrap CDK (if needed)
    spinner.start('Bootstrapping CDK environment...');
    try {
      execSync('npx cdk bootstrap', { stdio: 'pipe' });
      spinner.succeed('CDK environment bootstrapped');
    } catch (error) {
      spinner.warn('CDK bootstrap may have already been done');
    }

    console.log(chalk.green.bold('\n✅ AWS environment setup complete!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.white('1. Run: npm run deploy:aws'));
    console.log(chalk.white('2. Wait for deployment to complete'));
    console.log(chalk.white('3. Your app will be available on CloudFront URL'));

  } catch (error) {
    spinner.fail('Setup failed');
    console.error(chalk.red('Error:', error.message));
    process.exit(1);
  }
}

setupAWS();