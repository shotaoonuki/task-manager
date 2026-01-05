package com.example.taskapp.entity.agent;

import com.example.taskapp.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "agent_approvals")
public class AgentApproval extends AgentBaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agent_run_id", nullable = false, unique = true)
    private AgentRun agentRun;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_candidate_id")
    private AgentPlanCandidate approvedCandidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    private Instant approvedAt;

    @Column(columnDefinition = "TEXT")
    private String comment;
}
