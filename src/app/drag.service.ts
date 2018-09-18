import {Injectable} from '@angular/core';

@Injectable()
export class DragService {
  private zoneIDs: Array<string>;
  private availableZones: any = {};

  /**
   * @desc responsible for storing the draggable elements
   * zone target.
   * @param {Array<string>} zoneIDs - the zoneIDs
   */
  public startDrag(zoneIDs: Array<string>) {
    this.zoneIDs = zoneIDs;
    this.highLightAvailableZones();
  }

  /**
   * @desc responsible for matching the droppable element
   * with a draggable element
   * @param {string} zoneID - the zone ID to search for
   */
  public accepts(zoneID: string): boolean {
    return (this.zoneIDs.indexOf(zoneID) > -1);
  }

  /**
   * @desc responsible for removing highlighted available zones
   * that a draggable element can be added too.
   */
  public removeHighLightedAvailableZones(): void {
    this.zoneIDs.forEach((zone: string) => {
      this.availableZones[zone].end();
    });
  }

  /**
   * @desc responsible for adding an available zone
   * @param {{ begin: Function, end: Function }} zoneID - zone key from DroppableOptions
   * @param {string} obj - reference to a start and stop object
   */
  public addAvailableZone(zoneID: string, obj: { begin: Function, end: Function }): void {
    this.availableZones[zoneID] = obj;
  }

  /**
   * @desc responsible for removing an available zone
   * @param {string} zoneID - the zone ID to search for
   */
  public removeAvailableZone(zoneID: string): void {
    delete this.availableZones[zoneID];
  }

  /**
   * @desc responsible for highlighting available zones
   * that a draggable element can be added too.
   */
  private highLightAvailableZones(): void {
    this.zoneIDs.forEach((zone: string) => {
      this.availableZones[zone].begin();
    });
  }
}
