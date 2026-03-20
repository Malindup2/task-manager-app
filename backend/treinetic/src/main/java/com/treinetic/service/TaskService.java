package com.treinetic.service;

import com.treinetic.dto.TaskRequestDTO;
import com.treinetic.dto.TaskResponseDTO;
import java.util.List;

public interface TaskService {
    List<TaskResponseDTO> getAllTasks();
    TaskResponseDTO getTaskById(Long id);
    TaskResponseDTO createTask(TaskRequestDTO dto);
    TaskResponseDTO updateTask(Long id, TaskRequestDTO dto);
    void deleteTask(Long id);
}
