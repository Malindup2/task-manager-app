import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    status: ['TO_DO', Validators.required]
  });

  isEditMode = false;
  taskId: number | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => this.form.patchValue(task),
        error: () => this.toastr.error('Failed to load task', 'Error')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const task = this.form.value as any;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, task).subscribe({
        next: () => {
          this.toastr.success('Task updated successfully', 'Updated');
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to update task', 'Error');
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.toastr.success('Task created successfully', 'Created');
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Failed to create task', 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
