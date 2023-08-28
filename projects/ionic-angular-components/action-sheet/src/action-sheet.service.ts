/* eslint-disable @typescript-eslint/member-ordering,no-underscore-dangle */
import { Injectable } from '@angular/core';
import {ActionSheetController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  private _actionSheet: HTMLIonActionSheetElement;

  constructor(public actionSheetCtrl: ActionSheetController) {}

  set actionSheet(actionSheet: HTMLIonActionSheetElement) {
    this._actionSheet = actionSheet;
  }
  get actionSheet() {
    return this._actionSheet;
  }

  public async createActionSheet(title: string, buttons): Promise<HTMLIonActionSheetElement> {
    buttons = buttons.map(button => ({
      text: button.text,
      handler: () => {
        this.actionSheet.dismiss();
        button.handler();
      }
    }));
    this.actionSheet = await this.actionSheetCtrl.create({header: title, buttons});
    return Promise.resolve(this.actionSheet);
  }

  public async presentActionSheet(): Promise<void> {
    return await this.actionSheet.present();
  }
}
