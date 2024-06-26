import { Issue } from "@/core/interfaces/issues.interface";

export default function IssuesHoverCard({ issues }: { issues: Issue[] }) {
  return (
    <ul>
      {issues.map((issue) => (
        <li key={issue.key}>
          <a
            className=" hover:underline hover:text-blue-500 "
            href={`https://betterplan.atlassian.net/jira/software/c/projects/BT/boards/2?selectedIssue=${issue.key}`}
            target="_blank"
          >
            {issue.key}
          </a>
        </li>
      ))}
    </ul>
  );
}
