import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLayoutComponent } from './plan-layout.component';

describe('PlanLayoutComponent', () => {
  let component: PlanLayoutComponent;
  let fixture: ComponentFixture<PlanLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
