package com.example.taskapp.entity.agent;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class AgentDecisionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_run_id", nullable = false)
    private AgentRun agentRun;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentDecisionType decisionType;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(nullable = false, length = 2000)
    private String snapshot;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private AgentDecisionLog(AgentRun agentRun, AgentDecisionType decisionType, String reason,
            String snapshot) {
        this.agentRun = agentRun;
        this.decisionType = decisionType;
        this.reason = reason;
        this.snapshot = snapshot;
        this.createdAt = LocalDateTime.now();
    }

    public static AgentDecisionLog from(AgentRun run, AgentDecisionType decisionType, String reason,
            String snapshot) {
        return new AgentDecisionLog(run, decisionType, reason, snapshot);
    }

}
