import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', status: 'TO_DO' },
      { id: 2, title: 'Task 2', status: 'DONE' }
    ];

    service.getAllTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    // Check that request includes the cache buster query parameter
    const req = httpMock.expectOne((request) => request.urlWithParams.includes('cb='));
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should get task by id', () => {
    const mockTask: Task = { id: 1, title: 'Test', status: 'TO_DO' };
    
    service.getTaskById(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create a task', () => {
    const newTask: Task = { title: 'New', status: 'TO_DO' };
    
    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should update a task', () => {
    const updateTask: Task = { title: 'Updated', status: 'DONE' };
    
    service.updateTask(1, updateTask).subscribe(task => {
      expect(task).toEqual(updateTask);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateTask);
    req.flush(updateTask);
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
