package com.example.taskapp.repository;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // 👇 ログイン中ユーザーのタスク一覧取得
    List<Task> findByUser(User user);

    // 👇 「自分のタスクかどうか」を確認しつつ1件取得
    Optional<Task> findByIdAndUser(Long id, User user);
}
