package com.example.taskapp.repository.agent;

import com.example.taskapp.entity.agent.AgentApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AgentApprovalRepository extends JpaRepository<AgentApproval, UUID> {
    Optional<AgentApproval> findByAgentRun_Id(UUID runId);
}
