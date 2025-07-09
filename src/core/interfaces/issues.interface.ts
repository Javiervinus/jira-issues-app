export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      hierarchyLevel: number;
    };
    assignee: {
      self: string;
      accountId: string;
      emailAddress: string;
      avatarUrls: {
        "48x48": string;
        "24x24": string;
        "16x16": string;
        "32x32": string;
      };
      displayName: string;
      active: boolean;
      timeZone: string;
      accountType: string;
    };
    priority?: {
      self: string;
      iconUrl: string;
      name: string;
      id: string;
    };
    created?: string;
    updated?: string;
    labels?: Array<{
      id: string;
      name: string;
    }>;
    customfield_10016?: number; // Story Points
    parent?: {
      id: string;
      key: string;
      self: string;
      fields: {
        summary: string;
        status: {
          name: string;
        };
        issuetype: {
          name: string;
        };
      };
    };
    comment?: {
      comments: Array<{
        id: string;
        author: {
          displayName: string;
          accountId: string;
        };
        body: string;
        created: string;
        updated: string;
      }>;
      total: number;
    };
    worklog?: {
      worklogs: Array<{
        id: string;
        author: {
          displayName: string;
          accountId: string;
        };
        created: string;
        updated: string;
        started: string;
        timeSpent: string;
        timeSpentSeconds: number;
      }>;
      total: number;
    };
    timeestimate?: number; // seconds
    timeoriginalestimate?: number; // seconds
    timespent?: number; // seconds
    subtasks: {
      id: string;
      key: string;
      self: string;
      fields: {
        summary: string;
        status: {
          self: string;
          description: string;
          iconUrl: string;
          name: string;
          id: string;
          statusCategory: {
            self: string;
            id: number;
            key: string;
            colorName: string;
            name: string;
          };
        };
        priority: {
          self: string;
          iconUrl: string;
          name: string;
          id: string;
        };
        issuetype: {
          self: string;
          id: string;
          description: string;
          iconUrl: string;
          name: string;
          subtask: boolean;
          avatarId: number;
          hierarchyLevel: number;
        };
      };
    }[];
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: string;
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
  };
}
