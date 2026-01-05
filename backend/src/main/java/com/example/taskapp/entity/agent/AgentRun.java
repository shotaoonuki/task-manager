package com.example.taskapp.entity.agent;

import java.util.ArrayList;
import java.util.List;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import com.example.taskapp.service.agent.AgentActionResult;
import com.example.taskapp.service.agent.AgentDecision;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "agent_runs")
@Getter
@Setter
public class AgentRun extends AgentBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    private User requestedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentRunStatus status;

    @Column(columnDefinition = "TEXT")
    private String contextJson;

    @Column(columnDefinition = "TEXT")
    private String failureReason;
}

