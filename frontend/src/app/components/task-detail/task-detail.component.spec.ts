import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Task } from '../../models/task';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskServiceMock: any;
  let router: Router;

  const mockTask: Task = {
    id: 10,
    title: 'Review PR',
    description: 'Check out the new features branch',
    status: 'IN_PROGRESS',
    createdAt: '2026-03-20T10:00:00Z'
  };

  beforeEach(async () => {
    taskServiceMock = {
      getTaskById: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: taskServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '10' } } }
        }
      ]
    }).compileComponents();

    taskServiceMock.getTaskById.mockReturnValue(of(mockTask));
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component and load task details', () => {
    expect(component).toBeTruthy();
    expect(taskServiceMock.getTaskById).toHaveBeenCalledWith(10);
    expect(component.task).toEqual(mockTask);
  });

  it('should navigate back to tasks list', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should navigate to edit page', () => {
    component.editTask();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks/edit', 10]);
  });

  it('should return correct status classes and labels', () => {
    expect(component.getStatusClass('TO_DO')).toBe('status-todo');
    expect(component.getStatusClass('IN_PROGRESS')).toBe('status-progress');
    expect(component.getStatusClass('DONE')).toBe('status-done');
    
    expect(component.getStatusLabel('TO_DO')).toBe('To Do');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('In Progress');
    expect(component.getStatusLabel('DONE')).toBe('Done');
    expect(component.getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});
