import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteformComponent } from './completeform.component';

describe('CompleteformComponent', () => {
  let component: CompleteformComponent;
  let fixture: ComponentFixture<CompleteformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
