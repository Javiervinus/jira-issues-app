import { Issue } from "@/core/interfaces/issues.interface";

export default function IssuesHoverCard({ issues }: { issues: Issue[] }) {
  return (
    <ul>
      {issues.map((issue) => (
        <li key={issue.key}>
          <a
            className=" hover:underline hover:text-blue-500 md:block hidden"
            href={`https://betterplan.atlassian.net/jira/software/c/projects/BT/boards/2?selectedIssue=${issue.key}`}
            target="_blank"
          >
            {issue.key}
          </a>
          <a
            className=" hover:underline hover:text-blue-500 md:hidden block"
            href={`https://betterplan.atlassian.net/browse/${issue.key}`}
            target="_blank"
          >
            {issue.key}
          </a>
        </li>
      ))}
    </ul>
  );
}
