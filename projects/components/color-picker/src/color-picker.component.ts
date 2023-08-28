import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export const primaryAndSecondaryColors = {
  black: 'preto',
  blue: 'azul',
  brown: 'marrom',
  cyan: 'turquesa',
  gold: 'dourado',
  gray: 'cinza',
  green: 'verde',
  lime: 'limão',
  orange: 'laranja',
  pink: 'rosa',
  purple: 'roxo',
  red: 'vermelho',
  silver: 'prata',
  violet: 'violeta',
  white: 'branco',
  yellow: 'amarelo'
};

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {

  /**
   * Emits the hex number of the color
   */
  @Output() colorChosen = new EventEmitter<string>();
  namedColors = primaryAndSecondaryColors;
  colorNames = Object.keys(primaryAndSecondaryColors);

  constructor() { }

  ngOnInit() {}

  chooseColor(colorName: string){
    this.colorChosen.emit(colorName);
  }
}
