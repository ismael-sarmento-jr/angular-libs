import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[alphanumeric]'
})
export class AlphanumericDirective {

  private _regEx = /^[a-zA-Z]\w*(\s[a-zA-Z0-9]+)*\s?$/;

  constructor(private _el: ElementRef) {}

  @HostListener("ionInput", ["$event"]) 
  public onKeydown() {
    const value: string = this._el.nativeElement.value;
    if(!value) {
      return;
    }
    if (this._regEx.test(value)) {
      return;
    }
    this._el.nativeElement.value = value.replace(/^[\d]+|(?<=\s)[\s]|[^\w\s]|[_]/g, '');
  }

}
