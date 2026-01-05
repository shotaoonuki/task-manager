package com.example.taskapp.repository.agent;

import com.example.taskapp.entity.agent.AgentRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AgentRunRepository extends JpaRepository<AgentRun, UUID> {
}
