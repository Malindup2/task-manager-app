import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceMock: any;
  let toastrServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    taskServiceMock = {
      getTaskById: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn()
    };

    toastrServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } } // Mock route with ID 1 (Edit mode)
          }
        }
      ]
    }).compileComponents();
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      taskServiceMock.getTaskById.mockReturnValue(of({ id: 1, title: 'Existing Task', description: 'Desc', status: 'IN_PROGRESS' }));
      fixture = TestBed.createComponent(TaskFormComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      fixture.detectChanges(); // triggers ngOnInit
    });

    it('should initialize in edit mode and load task data', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.taskId).toBe(1);
      expect(taskServiceMock.getTaskById).toHaveBeenCalledWith(1);
      expect(component.form.value.title).toBe('Existing Task');
    });

    it('should call updateTask and navigate on submit', () => {
      taskServiceMock.updateTask.mockReturnValue(of({}));
      component.form.get('title')?.setValue('Updated Title');
      component.onSubmit();

      expect(component.isLoading).toBe(true);
      expect(taskServiceMock.updateTask).toHaveBeenCalled();
      expect(toastrServiceMock.success).toHaveBeenCalledWith('Task updated successfully', 'Updated');
      expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [TaskFormComponent, ReactiveFormsModule],
        providers: [
          provideRouter([]),
          { provide: TaskService, useValue: taskServiceMock },
          { provide: ToastrService, useValue: toastrServiceMock },
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: { get: () => null } } } // No ID (Create mode)
          }
        ]
      });
      fixture = TestBed.createComponent(TaskFormComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      fixture.detectChanges();
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.taskId).toBe(0); // Number(null) is 0
    });

    it('should call createTask and navigate on submit', () => {
      taskServiceMock.createTask.mockReturnValue(of({}));
      component.form.get('title')?.setValue('New Task');
      component.onSubmit();

      expect(component.isLoading).toBe(true);
      expect(taskServiceMock.createTask).toHaveBeenCalled();
      expect(toastrServiceMock.success).toHaveBeenCalledWith('Task created successfully', 'Created');
      expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('should validate form constraints', () => {
      component.form.get('title')?.setValue('');
      expect(component.form.valid).toBe(false);

      component.form.get('title')?.setValue('Valid Title');
      expect(component.form.valid).toBe(true);
    });
  });
});
