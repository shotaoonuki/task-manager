package com.example.taskapp.repository.agent;

import com.example.taskapp.entity.agent.AgentPlanCandidate;
import com.example.taskapp.entity.agent.AgentRun;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface AgentPlanCandidateRepository extends JpaRepository<AgentPlanCandidate, UUID> {

    List<AgentPlanCandidate> findByAgentRunId(UUID agentRunId);

    void deleteByAgentRun(AgentRun run);

    // ★ 追加（これが必要）
    Optional<AgentPlanCandidate> findByIdAndAgentRun(UUID id, AgentRun agentRun);
}

