import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxexComponent } from './checkboxex.component';

describe('CheckboxexComponent', () => {
  let component: CheckboxexComponent;
  let fixture: ComponentFixture<CheckboxexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
