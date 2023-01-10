import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PinchZoomEmitter, PinchZoomSegment } from '../plan-layout.component';

@Component({
  selector: 'app-plan-layout-milestone',
  templateUrl: './plan-layout-milestone.component.html',
  styleUrls: ['./plan-layout-milestone.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
  host: {
    '[class.app-milestone--animated]': 'animated',
    '[class.app-milestone--foregrounded]': 'foregrounded',
    '[style.--app-milestone-scale]': 'scale',
    '[style.--app-milestone-x]': 'xPosition + \'%\'',
    '[style.--app-milestone-y]': 'yPosition + \'%\'',
    '[attr.x-slot]': 'xSlot',
    '[attr.y-slot]': 'ySlot',
    '(click)': 'onClick($event)'
  }
})
export class PlanLayoutMilestoneComponent implements AfterViewInit, OnDestroy {
  @Input('x-slot') xSlot: 'left' | 'right' = 'left';
  @Input('y-slot') ySlot: 'top' | 'bottom' = 'top';
  @Input('x-position') xPosition: number = 0;
  @Input('y-position') yPosition: number = 0;
  public animated!: boolean;
  public foregrounded!: boolean;
  public scale: number = 1;
  public onClickEvent: EventEmitter<Event> = new EventEmitter<Event>();
  private onPinchZoomEvent$!: Subscription;

  ngOnDestroy(): void {
    if (!this.onPinchZoomEvent$) {
      return;
    }
    this.onPinchZoomEvent$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.onPinchZoomEvent$ = PinchZoomEmitter.eventEmitter.subscribe((event: PinchZoomSegment) => {
      this.animated = !event.zoomFactorEnd;
      if (!event.zoomFactorEnd || !event.balancedScale) {
        return;
      }
      this.scale = event.balancedScale;
    });
  }

  public onClick(event: Event): void {
    event.stopPropagation();
    this.onClickEvent.emit(event);
  }
}
