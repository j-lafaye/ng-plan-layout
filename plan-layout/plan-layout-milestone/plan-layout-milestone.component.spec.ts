import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLayoutMilestoneComponent } from './plan-layout-milestone.component';

describe('PlanLayoutMilestoneComponent', () => {
  let component: PlanLayoutMilestoneComponent;
  let fixture: ComponentFixture<PlanLayoutMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanLayoutMilestoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanLayoutMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
