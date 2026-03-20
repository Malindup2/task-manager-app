import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private toastr = inject(ToastrService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus = 'ALL';
  taskToDelete: number | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data || [];
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: () => this.toastr.error('Failed to load tasks', 'Error')
    });
  }

  applyFilter(): void {
    if (!this.selectedStatus || this.selectedStatus === 'ALL') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === this.selectedStatus);
    }
    this.cdr.detectChanges();
  }

  deleteTask(id: number): void {
    this.taskToDelete = id;
  }

  confirmDelete(): void {
    if (this.taskToDelete !== null) {
      this.taskService.deleteTask(this.taskToDelete).subscribe({
        next: () => {
          this.toastr.success('Task deleted successfully', 'Deleted');
          this.taskToDelete = null;
          this.loadTasks();
        },
        error: () => {
          this.toastr.error('Failed to delete task', 'Error');
          this.taskToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.taskToDelete = null;
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

  logout(): void {
    this.authService.logout();
    this.toastr.info('You have been logged out', 'Goodbye');
  }
}
