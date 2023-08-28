import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Output() cardClosed = new EventEmitter<any>();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() loading: boolean;
  @Input() theme: string;
  @Input() closeable = false;
  @Input() titlePlacement: 'start' | 'end' = 'start';
  /**
   * If true, fits to 100% of the component that contains the card.
   * If false, adjusts width to content size.
   */
  @Input() fitWidth = true;

  constructor() { }

  public showLoadingIndicator() {
    this.loading = true;
  }

  public hideLoadingIndicator() {
    this.loading = false;
  }

  public closeCard() {
    this.cardClosed.emit();
  }
}
