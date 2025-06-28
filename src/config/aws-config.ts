// AWS Configuration
export const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'your-user-pool-id',
    userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || 'your-client-id',
    identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || 'your-identity-pool-id',
  },
  API: {
    endpoints: [
      {
        name: 'TaskManagerAPI',
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
      }
    ]
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_S3_BUCKET || 'your-s3-bucket',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    }
  }
};

export const demoCredentials = {
  student: {
    email: 'student.demo@taskmanager.com',
    password: 'StudentDemo123!',
    type: 'student'
  },
  employee: {
    email: 'employee.demo@taskmanager.com', 
    password: 'EmployeeDemo123!',
    type: 'employee'
  }
};