package com.example.taskapp.repository.agent;

import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AgentStepRepository extends JpaRepository<AgentStep, UUID> {
    List<AgentStep> findByAgentRunOrderByStepOrderAsc(AgentRun agentRun);

    long countByAgentRun(AgentRun agentRun);

    List<AgentStep> findTop5ByAgentRunOrderByCreatedAtDesc(AgentRun run);

}
