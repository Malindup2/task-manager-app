import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(id).subscribe({
      next: (data) => this.task = data
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(): void {
    this.router.navigate(['/tasks/edit', this.task?.id]);
  }
}
