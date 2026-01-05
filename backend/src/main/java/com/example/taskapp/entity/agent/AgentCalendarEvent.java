package com.example.taskapp.entity.agent;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "agent_calendar_events")
public class AgentCalendarEvent extends AgentBaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true)
    private AgentPlanCandidate candidate;

    @Column(nullable = false)
    private String provider; // GOOGLE

    private String calendarId;

    private String externalEventId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CalendarEventStatus status;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;
}
