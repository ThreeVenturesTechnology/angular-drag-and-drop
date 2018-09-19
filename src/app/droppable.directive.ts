import {Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {DragService} from './drag.service';

// 1
@Directive({
  selector: '[appDroppable]'
})

export class DroppableDirective implements OnInit, OnDestroy {
  private onDragEnter: Function;
  private onDragLeave: Function;
  private onDragOver: Function;
  private onDrop: Function;

  public options: DroppableOptions = {
    zone: 'appZone'
  };

  // Allow options input by using [appDroppable]='{}'
  // 2
  @Input()
  set appDroppable(options: DroppableOptions) {
    if (options) {
      this.options = options;
    }
  }

  // Drop Event Emitter
  @Output() public onDroppableComplete: EventEmitter<DroppableEventObject> = new EventEmitter();

  // 3
  constructor(private elementRef: ElementRef
    , private renderer: Renderer2
    , private dragService: DragService) {
    this.renderer.addClass(this.elementRef.nativeElement, 'app-droppable');
  }

  // 4
  ngOnInit() {
    // Add available zone
    // This exposes the zone to the service so a draggable element can update it
    this.dragService.addAvailableZone(this.options.zone, {
      begin: () => {
        this.renderer.addClass(this.elementRef.nativeElement, 'js-app-droppable--target');
      },
      end: () => {
        this.renderer.removeClass(this.elementRef.nativeElement, 'js-app-droppable--target');
      }
    });
    this.addOnDragEvents();
  }

  // 5
  ngOnDestroy() {
    // Remove zone
    this.dragService.removeAvailableZone(this.options.zone);

    // Remove events
    this.onDragEnter();
    this.onDragLeave();
    this.onDragOver();
    this.onDrop();
  }

  /**
   * @desc responsible for adding the drag events
   */
  // 6
  private addOnDragEvents(): void {
    // Drag Enter
    this.onDragEnter = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragenter'
      , (event: DragEvent): void => {
        this.handleDragEnter(event);
      });
    this.onDragLeave = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragleave'
      , (event: DragEvent): void => {
        this.handleDragLeave(event);
      });
    // Drag Over
    this.onDragOver = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragover'
      , (event: DragEvent): void => {
        this.handleDragOver(event);
      });
    // Drag Drop
    this.onDrop = this.renderer.listen(
      this.elementRef.nativeElement
      , 'drop'
      , (event: DragEvent): void => {
        this.handleDrop(event);
      });
  }

  /**
   * @desc responsible for handling the dragenter event
   * @param event
   */
  // 7
  private handleDragEnter(event: DragEvent): void {
    if (this.dragService.accepts(this.options.zone)) {
      // Prevent default to allow drop
      event.preventDefault();
      // Add styling
      this.renderer.addClass(event.target, 'js-app-droppable--zone');
    }
  }

  /**
   * @desc responsible for handling the dragleave event
   * @param event
   */
  // 8
  private handleDragLeave(event: DragEvent): void {
    if (this.dragService.accepts(this.options.zone)) {
      // Remove styling
      this.renderer.removeClass(event.target, 'js-app-droppable--zone');
    }
  }

  /**
   * @desc responsible for handling the dragOver event
   * @param event
   */
  // 9
  private handleDragOver(event: DragEvent): void {
    if (this.dragService.accepts(this.options.zone)) {
      // Prevent default to allow drop
      event.preventDefault();
    }
  }

  /**
   * @desc responsible for handling the drop event
   * @param event
   */
  // 10
  private handleDrop(event: DragEvent): void {
    // Remove styling
    this.dragService.removeHighLightedAvailableZones();
    this.renderer.removeClass(event.target, 'js-app-droppable--zone');
    // Emit successful event
    const data = JSON.parse(event.dataTransfer.getData('Text'));
    this.onDroppableComplete.emit({
      data: data,
      zone: this.options.data
    });
  }
}

// 11
export interface DroppableOptions {
  data?: any;
  zone?: string;
}

// Droppable Event Object
export interface DroppableEventObject {
  data: any;
  zone: any;
}
