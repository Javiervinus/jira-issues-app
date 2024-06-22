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
