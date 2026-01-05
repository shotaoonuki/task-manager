package com.example.taskapp.entity.agent;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "agent_steps")
public class AgentStep extends AgentBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agent_run_id", nullable = false)
    private AgentRun agentRun;

    @Column(nullable = false)
    private int stepOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentDecisionType decisionType;

    @Lob
    private String reasoning; // 🧠 AIの判断理由

    @Lob
    private String observation; // 👁 状況要約

    @Column(length = 500)
    private String message; // UI表示用（任意）

    private String modelInfo;
}
