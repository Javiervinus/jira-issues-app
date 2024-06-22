import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getCurrentSprintIssues } from "@/lib/services/sprint-services";

export default async function AssigneeSection({
  currentSprint,
}: {
  currentSprint: SprintResume;
}) {
  const activeSprintNumber = parseInt(
    currentSprint?.name.replace("Tablero Sprint", "")
  );

  const issuesByAssignee = await getCurrentSprintIssues(currentSprint.id);
  return (
    <div
      className={`mb-32 grid mt-4 text-center gap-2 lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-${issuesByAssignee.length} lg:text-left`}
    >
      {issuesByAssignee.map((assignee) => (
        <div
          key={assignee.assignee.emailAddress}
          className="flex flex-col gap-4 p-4 rounded-lg border border-gray-300 dark:border-neutral-700 lg:p-6 lg:gap-6 lg:dark:border-neutral-800/30"
        >
          <h2 className="text-2xl font-semibold inline">
            {assignee.assignee.displayName}{" "}
            <span className="inline-flex items-center">
              <Avatar className="h-5 w-5">
                <AvatarImage src={assignee.assignee.avatarUrls["24x24"]} />
                <AvatarFallback>
                  {assignee.assignee.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </span>
            {assignee.assignee.displayName === "Claudio Godoi" && (
              <p className="block">
                <Badge variant="outline">
                  Sprint {activeSprintNumber - 12}
                </Badge>
              </p>
            )}
          </h2>

          <div className=" flex w-full flex-col gap-2">
            <span>
              Por hacer:{" "}
              {assignee.totalIssues -
                assignee.doneIssues -
                assignee.inProgressIssues}{" "}
            </span>
            <span>En progreso: {assignee.inProgressIssues} </span>
            <span>Hechas: {assignee.doneIssues} </span>
          </div>
          {/* <ul className="flex flex-col gap-2 text-sm">
            {assignee.issues.map((issue) => (
              <li
                key={issue.key}
                className="flex gap-2 items-center justify-between"
              >
                <span>{issue.key}</span>
                <span>{issue.fields.issuetype.name}</span>
              </li>
            ))}
          </ul> */}
        </div>
      ))}

      {/* <a
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Docs{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          Find in-depth information about Next.js features and API.
        </p>
      </a>

      <a
        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Learn{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          Learn about Next.js in an interactive course with&nbsp;quizzes!
        </p>
      </a>

      <a
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Templates{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          Explore starter templates for Next.js.
        </p>
      </a>

      <a
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Deploy{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
          Instantly deploy your Next.js site to a shareable URL with Vercel.
        </p>
      </a> */}
    </div>
  );
}
