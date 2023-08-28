import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private alertController: AlertController
  ) { }

  public async presentDialog(
    message: string,
    onConfirm: (arg?: any) => void,
    onCancel: (arg?: any) => void = () => {}
  ): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      message,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: onCancel,
        },
        {
          text: 'Sim',
          role: 'confirm',
          handler: onConfirm,
        },
      ],
    });
    await alert.present();
    return Promise.resolve(alert);
  }
}
