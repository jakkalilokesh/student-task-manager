import { Task } from '../types';
import { useDataStore } from '../store/dataStore';

export class TaskService {
  static createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to local storage
    useDataStore.getState().addTask(task);

    // Simulate AWS DynamoDB save
    this.saveToDynamoDB(task);

    // Create notification reminder if reminder time is set
    if (task.reminderTimes.length > 0) {
      this.scheduleReminders(task);
    }

    return task;
  }

  static updateTask(id: string, updates: Partial<Task>): void {
    useDataStore.getState().updateTask(id, updates);
    
    // Simulate AWS DynamoDB update
    this.updateInDynamoDB(id, updates);
  }

  static deleteTask(id: string): void {
    useDataStore.getState().deleteTask(id);
    
    // Simulate AWS DynamoDB delete
    this.deleteFromDynamoDB(id);
  }

  static getUserTasks(userId: string): Task[] {
    return useDataStore.getState().getUserTasks(userId);
  }

  // Simulated AWS DynamoDB operations
  private static async saveToDynamoDB(task: Task): Promise<void> {
    console.log('Saving task to DynamoDB:', task);
    // In real implementation, this would use AWS SDK
    // const dynamodb = new AWS.DynamoDB.DocumentClient();
    // await dynamodb.put({
    //   TableName: 'TaskManager-Tasks',
    //   Item: task
    // }).promise();
  }

  private static async updateInDynamoDB(id: string, updates: Partial<Task>): Promise<void> {
    console.log('Updating task in DynamoDB:', id, updates);
    // In real implementation, this would use AWS SDK
  }

  private static async deleteFromDynamoDB(id: string): Promise<void> {
    console.log('Deleting task from DynamoDB:', id);
    // In real implementation, this would use AWS SDK
  }

  private static scheduleReminders(task: Task): void {
    console.log('Scheduling reminders for task:', task.id);
    // In real implementation, this would use AWS EventBridge
    // to schedule email/SMS reminders via SES/SNS
  }

  // Email notification via AWS SES
  static async sendEmailReminder(task: Task, userEmail: string): Promise<void> {
    console.log('Sending email reminder via AWS SES:', task.title, userEmail);
    // In real implementation:
    // const ses = new AWS.SES();
    // await ses.sendEmail({
    //   Source: 'noreply@taskmanager.com',
    //   Destination: { ToAddresses: [userEmail] },
    //   Message: {
    //     Subject: { Data: `Task Reminder: ${task.title}` },
    //     Body: { Text: { Data: `Your task "${task.title}" is due soon.` } }
    //   }
    // }).promise();
  }

  // SMS notification via AWS SNS
  static async sendSMSReminder(task: Task, phoneNumber: string): Promise<void> {
    console.log('Sending SMS reminder via AWS SNS:', task.title, phoneNumber);
    // In real implementation:
    // const sns = new AWS.SNS();
    // await sns.publish({
    //   PhoneNumber: phoneNumber,
    //   Message: `Task Reminder: "${task.title}" is due soon.`
    // }).promise();
  }
}