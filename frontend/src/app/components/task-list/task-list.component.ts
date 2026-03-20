import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule,
            MatTableModule, MatButtonModule, MatSelectModule,
            MatFormFieldModule, MatIconModule, MatChipsModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus = 'ALL';
  displayedColumns = ['title', 'description', 'status', 'createdAt', 'actions'];

  constructor(private taskService: TaskService,
              public authService: AuthService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    this.filteredTasks = this.selectedStatus === 'ALL'
      ? this.tasks
      : this.tasks.filter(t => t.status === this.selectedStatus);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks()
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'TO_DO': return 'primary';
      case 'IN_PROGRESS': return 'accent';
      case 'DONE': return 'warn';
      default: return '';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
