package com.example.taskapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.taskapp.entity.AiDecisionLog;

@Repository
public interface AiDecisionLogRepository extends JpaRepository<AiDecisionLog, Long> {
}
