/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'ion-template',
  templateUrl: './ion-template.component.html',
  styleUrls: ['./ion-template.component.scss'],
})
export class IonTemplateComponent implements OnInit {

  @Input() template: TemplateRef<any>;

  constructor() { }

  ngOnInit() {}

}
