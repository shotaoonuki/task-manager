package com.example.taskapp.repository;

import com.example.taskapp.entity.Subtask;
import com.example.taskapp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
    List<Subtask> findByTask(Task task);
    void deleteByTask(Task task);
}

