import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {DragService} from './drag.service';

@Directive({
  selector: '[appDraggable]'
})

export class DraggableDirective implements OnInit, OnDestroy {

  // Events
  private onDragStart: Function;
  private onDragEnd: Function;

  // Options for the directive
  private options: DraggableOptions;

  // Allow options input by using [appDraggable]='{}'
  // This is a typescript accessor for setting a value
  @Input()
  set appDraggable(options: DraggableOptions) {
    if (options) {
      this.options = options;
    }
  }

  constructor(private elementRef: ElementRef
    , private renderer: Renderer2
    , private dragService: DragService) {

    // Se the draggable property
    this.renderer.setProperty(this.elementRef.nativeElement, 'draggable', true);
    this.renderer.addClass(this.elementRef.nativeElement, 'app-draggable');
  }

  ngOnInit() {
    this.addDragEvents();
  }

  ngOnDestroy() {
    // Remove events
    this.onDragStart();
    this.onDragEnd();
  }

  /**
   * @desc responsible for adding the drag events to the directive
   * @note transfers drag data using the Drag and Drop API (Browser)
   * @note known CSS issue where a draggable element cursor cant be set
   * while dragging in Chrome
   */
  private addDragEvents(): void {
    this.onDragStart = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragstart'
      , (event: DragEvent): void => {
        this.dragService.startDrag(this.options.zones);
        // Transfer the data using Drag and Drop API (Browser)
        event.dataTransfer
          .setData('Text'
            , JSON.stringify(this.options.data));
      });

    this.onDragEnd = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragend'
      , (event: DragEvent): void => {
        this.dragService.removeHighLightedAvailableZones();
      });
  }
}

// Export the interface for use throughout the application
export interface DraggableOptions {
  zones?: Array<string>;
  data?: any;
}
