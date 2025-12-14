package com.example.taskapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.taskapp.entity.AiDecisionLog;

@Repository
public interface AiDecisionLogRepository
        extends JpaRepository<AiDecisionLog, Long> {

    List<AiDecisionLog> findByTaskIdOrderByCreatedAtDesc(Long taskId);
}
