import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { provideRouter } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceMock: any;
  let authServiceMock: any;
  let toastrServiceMock: any;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', status: 'TO_DO' },
    { id: 2, title: 'Task 2', status: 'IN_PROGRESS' },
    { id: 3, title: 'Task 3', status: 'DONE' }
  ];

  beforeEach(async () => {
    taskServiceMock = {
      getAllTasks: vi.fn(),
      deleteTask: vi.fn()
    };

    authServiceMock = {
      logout: vi.fn(),
    };

    toastrServiceMock = {
      success: vi.fn(),
      info: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    taskServiceMock.getAllTasks.mockReturnValue(of(mockTasks));
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load tasks', () => {
    expect(component).toBeTruthy();
    expect(taskServiceMock.getAllTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(3);
    expect(component.filteredTasks.length).toBe(3);
  });

  it('should filter tasks correctly', () => {
    component.selectedStatus = 'TO_DO';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].id).toBe(1);

    component.selectedStatus = 'DONE';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].id).toBe(3);
  });

  it('should initiate task deletion flow', () => {
    component.deleteTask(2);
    expect(component.taskToDelete).toBe(2);
  });

  it('should cancel delete process', () => {
    component.deleteTask(2);
    component.cancelDelete();
    expect(component.taskToDelete).toBeNull();
  });

  it('should confirm delete and call service', () => {
    taskServiceMock.deleteTask.mockReturnValue(of(null));
    component.deleteTask(2);
    component.confirmDelete();

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(2);
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Task deleted successfully', 'Deleted');
    expect(component.taskToDelete).toBeNull();
  });

  it('should return correct status classes and labels', () => {
    expect(component.getStatusClass('TO_DO')).toBe('status-todo');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('In Progress');
  });

  it('should logout and call auth service', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(toastrServiceMock.info).toHaveBeenCalledWith('You have been logged out', 'Goodbye');
  });
});
