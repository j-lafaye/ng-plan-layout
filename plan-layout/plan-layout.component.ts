import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import PinchZoom from 'pinch-zoom-js';
import { PlanLayoutMilestoneComponent } from './plan-layout-milestone/plan-layout-milestone.component';
export class PinchZoomEmitter {
  private static _eventEmitter: EventEmitter<PinchZoomSegment>;
  static get eventEmitter(): EventEmitter<PinchZoomSegment> {
    return this._eventEmitter;
  }
  static set eventEmitter(_value: EventEmitter<PinchZoomSegment>) {
    this._eventEmitter = _value;
  }
}
export type PinchZoomSegment = {
  zoomFactorStart?: number,
  zoomFactorEnd?: number,
  balancedScale?: number
}
export type Dimens = {
  width: number,
  height: number
}
export interface IPinchZoomEvent {
  container: string;
  el: string;
  enabled: boolean;
  inAnimation: boolean;
  initialOffset: { x: number, y: number };
  is3d: boolean;
  isDoubleTap: boolean;
  lastScale: number;
  offset: { x: number, y: number };
  options: {
    animationDuration: number;
    doubleTapEventName: string;
    dragEndEventName: string;
    dragStartEventName: string;
    dragUpdateEventName: string;
    draggableUnzoomed: boolean;
    horizontalPadding: number;
    lockDragAxis: boolean;
    maxZoom: number;
    minZoom: number;
    onDoubleTap: () => {};
    onDragEnd: (event: Event) => {};
    onDragStart: () => {};
    onDragUpdate: null
    onZoomEnd: (event: Event) => {};
    onZoomStart: () => {};
    onZoomUpdate: (event: Event) => {};
    setOffsetsOnce: boolean;
    tapZoomFactor: number;
    use2d: boolean;
    verticalPadding: number;
    zoomEndEventName: string;
    zoomOutFactor: number;
    zoomStartEventName: string;
    zoomUpdateEventName: string;
  };
  resizeHandler: void;
  updatePlanned: boolean;
  zoomFactor: number;
  _isOffsetSet: boolean;
}

@Component({
  selector: 'app-plan-layout',
  templateUrl: './plan-layout.component.html',
  styleUrls: ['./plan-layout.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PlanLayoutComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(PlanLayoutMilestoneComponent, { read: PlanLayoutMilestoneComponent }) milestones!: QueryList<PlanLayoutMilestoneComponent>;
  @HostListener('window:resize', ['$event']) onWindowResize() {
    if (!this.imageContainerElement || !this.pinchZoomElement || !this.imageDimens) {
      return;
    }
    this.imageContainerElement.style.height = this.pinchZoomElement.style.height = this.getImageContainerHeight();
  };
  @Input('image') image!: string;
  @ViewChild('imageContainer', { static: true, read: ElementRef }) set imageContainerRef(imageContainerRef: ElementRef) {
    this.imageContainerElement = imageContainerRef.nativeElement;
  }
  @ViewChild('image', { static: true, read: ElementRef }) set imageRef(imageRef: ElementRef) {
    this.imageElement = imageRef.nativeElement;
  }
  private imageContainerElement!: HTMLElement;
  private imageElement!: HTMLElement;
  private imageDimens!: Dimens;
  private _pinching!: boolean;
  get pinching(): boolean {
    return this._pinching;
  }
  set pinching(value: boolean) {
    if (value === this._pinching) {
      return;
    }
    this._pinching = value;
    if (this.pinching) {
      this.pinchZoomSegment.zoomFactorStart = this.pinchZoomEvent['zoomFactor'];
      this.pinchZoomSegment.zoomFactorEnd = undefined;
      PinchZoomEmitter.eventEmitter.emit(this.pinchZoomSegment);
      return;
    }
    this.pinchZoomSegment.zoomFactorEnd = this.pinchZoomEvent['zoomFactor'];
    if (!this.pinchZoomSegment.zoomFactorStart || !this.pinchZoomSegment.zoomFactorEnd) {
      return;
    }
    if (this.pinchZoomSegment.zoomFactorEnd == this.pinchZoomSegment.zoomFactorStart) {
      return;
    }
    this.pinchZoomSegment.balancedScale = 1 / this.pinchZoomSegment.zoomFactorEnd;
    PinchZoomEmitter.eventEmitter.emit(this.pinchZoomSegment);
  }
  private pinchTimestamp!: number;
  private pinchZoom!: PinchZoom;
  private pinchZoomElement!: HTMLElement | null;
  private pinchZoomEvent!: IPinchZoomEvent;
  private pinchZoomSegment: PinchZoomSegment = {};
  private readonly pinchZoomAnimationDuration: number = 300;

  constructor() {
    PinchZoomEmitter.eventEmitter = new EventEmitter();
  }

  ngAfterContentInit(): void {
    if (!this.imageContainerElement || !this.imageElement) {
      return;
    }
    this.getImageDimens(this.image).then(dimens => {
      if (dimens.width < dimens.height) {
        console.error('Portrait image resolution not supported');
        return;
      }
      this.imageDimens = { width: dimens.width, height: dimens.height };
      this.imageContainerElement.style.height = this.getImageContainerHeight();
      this.imageElement.style.backgroundImage = 'url(' + this.image + ')';
      this.imageContainerElement.style.visibility = 'visible';
      this.milestones.forEach(milestone => {
        milestone.onClickEvent.subscribe(() => {
          if (milestone.foregrounded) {
            return;
          }
          milestone.foregrounded = true;
          this.milestones.forEach(_milestone => {
            _milestone.foregrounded = _milestone == milestone;
          });
        });
      });
      this.pinchZoom = new PinchZoom(this.imageElement, {
        minZoom: 1,
        use2d: false,
        onDoubleTap: () => {},
        onDragEnd: (event: unknown) => {
          this.onPinchZoomComplete(event);
        },
        onDragStart: () => {},
        onZoomEnd: (event: unknown) => {
          this.onPinchZoomComplete(event);
        },
        onZoomStart: () => {},
        onZoomUpdate: (event: unknown) => {
          if (!this.isPinchZoomEvent(event)) {
            return;
          }
          this.pinchTimestamp = Date.now();
          if (!this.pinching) {
            this.pinchZoomEvent = event;
            this.pinching = true;
          }
          setTimeout(() => {
            if (Date.now() - this.pinchTimestamp >= this.pinchZoomAnimationDuration) {
              this.onPinchZoomComplete(event);
            }
          }, this.pinchZoomAnimationDuration);
        }
      });
      this.pinchZoomElement = this.imageElement.parentElement;
      if (!this.pinchZoomElement) {
        return;
      }
      this.pinchZoomElement.style.overflow = 'visible';
    });
  }

  ngOnDestroy(): void {
    this.milestones.forEach(milestone => {
      milestone.onClickEvent.unsubscribe();
    });
  }

  private getImageContainerHeight(): string {
    return (this.imageContainerElement.clientWidth * (((this.imageDimens.height / this.imageDimens.width) * 100) / 100)) + 'px';
  }

  private getImageDimens(image: string): Promise<Dimens> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({
        width: img.width,
        height: img.height
      });
      img.onerror = reject;
      img.src = image;
    });
  }

  private isPinchZoomEvent(event: unknown): event is IPinchZoomEvent {
    return (event as IPinchZoomEvent)?.container !== undefined;
  }

  private onPinchZoomComplete(event: unknown): void {
    if (!this.pinching || !this.isPinchZoomEvent(event)) {
      return;
    }
    this.pinchZoomEvent = event;
    this.pinching = false;
  }
}
