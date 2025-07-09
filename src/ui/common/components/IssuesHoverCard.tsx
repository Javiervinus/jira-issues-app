import { Issue } from "@/core/interfaces/issues.interface";

export default function IssuesHoverCard({ issues }: { issues: Issue[] }) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "Highest":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Lowest":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "story":
        return "📖";
      case "task":
        return "✅";
      case "bug":
        return "🐛";
      case "epic":
        return "🎯";
      case "sub-task":
        return "🔧";
      default:
        return "📋";
    }
  };

  if (issues.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
        No hay issues para mostrar
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      {/* Header with total count */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Issues ({issues.length})
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Click para abrir en JIRA
        </span>
      </div>

      {/* Scrollable grid container */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="grid grid-cols-2 gap-2 pr-2">
          {issues.map((issue) => (
            <div key={issue.key} className="group">
              <a
                className="block p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 h-full"
                href={`https://betterplan.atlassian.net/jira/software/c/projects/BT/boards/2?selectedIssue=${issue.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Header: Key + Type */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      {issue.key}
                    </span>
                    <span className="text-xs">
                      {getIssueTypeIcon(issue.fields.issuetype.name)}
                    </span>
                  </div>
                  {issue.fields.priority && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        issue.fields.priority.name
                      )}`}
                    >
                      {issue.fields.priority.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Summary - truncated for grid */}
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 leading-tight">
                    {issue.fields.summary}
                  </p>
                </div>

                {/* Footer: Status + Story Points */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-xs truncate">
                    {issue.fields.status.name}
                  </span>
                  {issue.fields.customfield_10016 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 ml-1">
                      {issue.fields.customfield_10016}pts
                    </span>
                  )}
                </div>

                {/* Subtask indicator */}
                {issue.fields.issuetype.subtask && (
                  <div className="mt-1">
                    <span className="inline-block text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      Subtask
                    </span>
                  </div>
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
