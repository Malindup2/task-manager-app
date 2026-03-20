import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
            MatFormFieldModule, MatInputModule, MatSelectModule,
            MatButtonModule, MatCardModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    status: ['TO_DO', Validators.required]
  });

  isEditMode = false;
  taskId: number | null = null;
  errorMessage = '';

  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => this.form.patchValue(task)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const task = this.form.value as any;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.errorMessage = 'Failed to update task'
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.errorMessage = 'Failed to create task'
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
