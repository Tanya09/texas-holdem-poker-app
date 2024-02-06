import { Component, Inject, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SaveCardsDataEvent } from '../../shared/models/cards-input-data';

@Component({
  selector: 'app-dynamic-modal',
  template: `<div #dynamicComponentContainer></div>`,
  styleUrls: ['./dynamic-modal.component.css']
})

export class DynamicModalComponent {
  private saveCardsDataSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.loadDynamicContent(this.data.contentComponent);
  }

  onClick(): void {
    this.dialogRef.close();
  }

  loadDynamicContent(componentType: any) {
    this.viewContainerRef.clear();
    const componentRef: ComponentRef<any> =
      this.viewContainerRef.createComponent(componentType);

    if ('saveCardsData' in componentRef.instance) {
      this.saveCardsDataSubscription =
        componentRef.instance.saveCardsData.subscribe((event: SaveCardsDataEvent) => {
          // Handle the emitted data
          setTimeout(() => {
            this.dialogRef.close({ cardsData: event });
          }, 0);
        });
    } else {
      console.error(
        `Dynamic component does not implement saveCardsData EventEmmiter.`
      );
    }
  }

}
