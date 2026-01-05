package com.example.taskapp.service.agent;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 着手候補日を生成するだけの最小クラス
 */
@Service
public class CandidateGenerator {

    public List<LocalDate> generate(LocalDate dueDate) {
        if (dueDate == null) {
            return List.of();
        }
        return List.of(dueDate.minusDays(2), dueDate.minusDays(1), dueDate);
    }
}

