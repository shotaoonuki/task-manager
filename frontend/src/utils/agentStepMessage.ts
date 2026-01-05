// frontend/src/utils/agentStepMessage.ts
export const agentStepMessageMap: Record<string, string> = {
  INPUT_SNAPSHOT: "タスク内容を解析中…",
  GENERATE_SUBTASKS: "サブタスクを生成しました",
  ESTIMATE_EFFORT: "作業工数を見積もっています",
  PRIORITIZE: "優先度を最適化しています",
  BACKSCHEDULE: "締切から逆算しています",
  BUILD_PLAN: "実行計画を構築しています",
  WAIT_FOR_APPROVAL: "人間の承認を待っています",
  SCHEDULE_TO_CALENDAR: "Googleカレンダーに登録中…",
  COMPLETE: "エージェント処理が完了しました",
  ERROR: "エラーが発生しました",
};
