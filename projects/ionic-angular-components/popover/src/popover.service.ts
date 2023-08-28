import {Injectable, TemplateRef} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {IonTemplateComponent} from 'ionic-angular-components/ion-template';
import {OverlayEventDetail} from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  async presentPopover(template: TemplateRef<any>, event: MouseEvent): Promise<OverlayEventDetail> {
    const popover = await this.popoverCtrl.create({
      component: IonTemplateComponent,
      componentProps: {template}
    });
    popover.event = event;
    await popover.present();
    return popover.onWillDismiss();
  }
}
