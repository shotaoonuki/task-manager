package com.example.taskapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;           // タスク名
    private String description;     // 詳細
    private boolean completed;      // 完了フラグ
    private LocalDateTime createdAt; // 作成日時

    private LocalDate dueDate;   // 締切日
    private String priority;     // 優先度（low, medium, high）

}
