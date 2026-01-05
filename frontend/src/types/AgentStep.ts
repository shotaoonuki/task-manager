// // frontend/src/types/AgentStep.ts

// export type AgentStep = {
//   id: string;

//   /** AI が選択した行動 */
//   decisionType:
//     | "REQUEST_USER_INPUT"
//     | "GENERATE_SUBTASKS"
//     | "BUILD_PLAN"
//     | "WAIT_FOR_APPROVAL"
//     | "EXECUTE_PLAN"
//     | "COMPLETE";

//   message?: string | null; // ★追加

//   /** 👁 AI が認識している現在状況 */
//   observation: string;

//   /** 🧠 なぜその判断をしたか */
//   reasoning: string;

//   /** 判断時刻 */
//   createdAt: string;
// };

// export type AgentStep = {
//   id: string;

//   /** 実行フェーズや判断種別 */
//   type:
//     | "REQUEST_USER_INPUT"
//     | "GENERATE_SUBTASKS"
//     | "BUILD_PLAN"
//     | "WAIT_FOR_APPROVAL"
//     | "EXECUTE_PLAN"
//     | "COMPLETE";

//   /** 人間向けログ（最重要） */
//   message: string;

//   /** 記録時刻 */
//   createdAt: string;
// };

export type AgentStep = {
  id: string;

  /** AIが選んだ行動 */
  decisionType:
    | "REQUEST_USER_INPUT"
    | "GENERATE_SUBTASKS"
    | "BUILD_PLAN"
    | "WAIT_FOR_APPROVAL"
    | "EXECUTE_PLAN"
    | "COMPLETE";

  /** 👁 AIの状況認識（判断ログ用） */
  observation?: string | null;

  /** 🧠 AIの判断理由（判断ログ用） */
  reasoning?: string | null;

  /** ⚙ 実行ステージ・人間向けログ */
  message?: string | null;

  /** 記録時刻 */
  createdAt: string;
};
