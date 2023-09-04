import { Component } from '@angular/core';

export type ActionHandler = (event?: any) => Promise<any>;

export interface Action {
  title: string;
  handler: ActionHandler;
  display?: () => boolean;
}


@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html'
})
export class PageMenuComponent {

  actionSelected: (handler: ActionHandler) => any;
  actions: Action[];

  constructor() { }

}
