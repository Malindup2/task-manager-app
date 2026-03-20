import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  task: Task | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(id).subscribe({
      next: (data) => this.task = data
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO_DO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-progress';
      case 'DONE': return 'status-done';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'TO_DO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(): void {
    this.router.navigate(['/tasks/edit', this.task?.id]);
  }
}
