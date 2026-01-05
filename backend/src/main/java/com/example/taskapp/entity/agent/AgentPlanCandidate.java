package com.example.taskapp.entity.agent;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "agent_plan_candidates")
public class AgentPlanCandidate extends AgentBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agent_run_id", nullable = false)
    private AgentRun agentRun;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    private int durationDays = 1;

    private boolean allDay = true;

    // ★ これを追加
    @Column(nullable = false)
    private boolean recommended = false;

    private boolean selected = false;

    private Integer priorityScore;

    // AgentPlanCandidate.java
    @ElementCollection
    @CollectionTable(name = "agent_plan_candidate_subtasks",
            joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "subtask_title")
    private List<String> plannedSubtasks;

}
