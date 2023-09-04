/* eslint-disable max-len */
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ionic-angular-ext/components/confirm-dialog';
import { IonContent, NavController, Platform, PopoverController } from '@ionic/angular';
import { Action, ActionHandler, PageMenuComponent } from './page-menu.component';
import { ModalService } from '@ionic-angular-ext/components/modal';
import { Subscription } from 'rxjs';

export interface HeaderButton {
  title: string;
  icon: string;
  data?: any;
  handler: (data?: any) => any;
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnDestroy {

  @ViewChild('content') content: IonContent; 
  @Input() title: string;
  @Input() headerButtons: HeaderButton[];
  @Input() showSideMenu = false;

  private _navSubs: Subscription;
  @Input() canGoBack = false;
  @Input() pendingChanges: boolean;

  private _headerMenuActions: Action[];
  popover: HTMLIonPopoverElement;
  
  constructor(
    private _confirmationService: ConfirmDialogService,
    private _modalService: ModalService,
    private _navCtrl: NavController,
    private _platform: Platform,
    private _popoverController: PopoverController
  ) {
    this.setupSystemBackButtonAction();
  }

  public get headerMenuActions(): Action[] {
    return this._headerMenuActions;
  }
  @Input()
  public set headerMenuActions(headerMenuActions: Action[]) {
    this._headerMenuActions = headerMenuActions;
    if(this._headerMenuActions) {
      this.createHeaderPopoverMenu();
    }
  }

  ngOnDestroy(): void {
    this._navSubs?.unsubscribe();
  }

  /**
   * On system/hardware back button clicked, either close modal or navigate back one page.
   */
  setupSystemBackButtonAction() {
    this._navSubs = this._platform.backButton.subscribeWithPriority(2, async () => {
      if(this._modalService.hasOpenModal()) {
        this._modalService.closeModal();
      } else if(this.canGoBack) {
        await this.goBack();
      }
    });
  }

  /**
   * Creating ionic popover is somehow expensive, so this function should be called way prior 
   * presenting the popover menu.
   * Calls popoverCtrl.create, which instantiates a new ion popover object and appends the dom
   * element to the ion-app.
   * Triggers another creation, after the popover is dismissed, to improve response time.
   */
  async createHeaderPopoverMenu() {
    this.popover = await this._popoverController.create({
      component: PageMenuComponent,
      componentProps: {
        actionSelected: async (handler: ActionHandler) => {
          this._popoverController.dismiss();
          await handler();
          this.createHeaderPopoverMenu();
        },
        actions: this.headerMenuActions?.filter(action => !action.display || action.display())
      }
    });
  }

  async presentPopoverMenu(clickEvent: Event) {
    this.popover.event = clickEvent;
    this.popover.present();
    this.popover.onDidDismiss().then(() => this.createHeaderPopoverMenu());
  }

  public scrollToTop() {
    this.content.scrollToTop(500);
  }

  async goBack() {
    if(this.pendingChanges) {
      await this._confirmationService.presentDialog('Modificações não foram salvas. Voltar mesmo assim?', 
        () => this._navCtrl.back()
      );
    } else {
      this._navCtrl.back();
    }
  }
}
