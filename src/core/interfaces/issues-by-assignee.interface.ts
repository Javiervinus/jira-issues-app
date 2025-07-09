import { Issue } from "./issues.interface";

export interface IssueByAssignee {
  assignee: {
    emailAddress: string;
    avatarUrls: {
      "48x48": string;
      "24x24": string;
      "16x16": string;
      "32x32": string;
    };
    displayName: string;
  };
  issues: Issue[];
  doneIssues: number;
  totalIssues: number;
  inProgressIssues: number;
  toDoIssues: number;
  performance: number;
  // Additional metrics
  highPriorityIssues?: number;
  recentlyUpdatedIssues?: number;
  averageCompletionTime?: number; // días promedio para completar tasks
  mainTasksCount?: number;
  subtasksCount?: number;
  mostCommonIssueType?: string;
  // NEW: Story Points and time tracking
  totalStoryPoints?: number;
  completedStoryPoints?: number;
  // Labels
  mostCommonLabel?: Record<string, number>;
  mostCommonLabelName?: string;
  // Epic distribution
  epicsWorked?: Record<string, number>;
  // Time tracking
  totalTimeEstimate?: number; // in hours
  totalTimeSpent?: number; // in hours
  timeEfficiency?: number; // percentage
}
