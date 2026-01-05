type Props = {
  contextJson?: string | null;
};

export function AgentPlanSummary({ contextJson }: Props) {
  if (!contextJson) return null;

  let plan;
  try {
    const ctx = JSON.parse(contextJson);
    plan = ctx?.plan?.candidates?.[0];
  } catch {
    return null;
  }

  if (!plan) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-white">
      <div className="font-semibold mb-2">📅 AIが提案した計画</div>

      <div className="text-sm text-gray-700">
        <div>
          開始日：<b>{plan.startDate}</b>
        </div>
        <div>
          期間：<b>{plan.durationDays}日</b>
        </div>

        {plan.plannedSubtasks?.length > 0 && (
          <>
            <div className="mt-2 font-medium">実行内容：</div>
            <ul className="list-disc ml-5">
              {plan.plannedSubtasks.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
