import { Injectable, TemplateRef } from '@angular/core';
import { IonTemplateComponent } from 'angular-ionic-base/ion-template';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _modal: HTMLIonModalElement;
  private _closingModal: Promise<boolean>;

  constructor(
    private modalController: ModalController
  ) { }

  public hasOpenModal(): boolean {
    return this._modal != null;
  }

  /**
   *
   * @param template a template reference to be rendered
   * @returns dismiss event promise
   */
  public async presentModal(template: TemplateRef<any>, autoFocus?: boolean): Promise<OverlayEventDetail> {
    if(!template) {
      return Promise.resolve(null);
    }
    if(this._closingModal) {
      await this._closingModal;
    }
    if(!this._modal) {
      this._modal = await this.modalController.create(
       {
         component: IonTemplateComponent,
         cssClass: ['modal'],
         backdropDismiss: false,
         componentProps: {template}
       }
     );
    }
    await this._modal.present();
    if(autoFocus) {
      setTimeout(() => this._modal.querySelector('input').focus(), 100);
    }
    return this._modal.onWillDismiss();
  }

  async closeModal(data?: any): Promise<boolean> {
    this._closingModal = this.modalController.dismiss(data);
    this._modal = null;
    return this._closingModal;
  }
}
