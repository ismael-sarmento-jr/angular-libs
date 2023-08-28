import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';

export interface MoveEvent { 
  from: number; 
  to: number; 
}

@Component({
  selector: 'app-orderable-list',
  templateUrl: './orderable-list.component.html',
  styleUrls: ['./orderable-list.component.scss'],
})
export class OrderableListComponent<T> implements OnInit, AfterViewInit {

  /**
   * Can be used in one way binding, or two way.
   * If using two way binding, no need to show options tray.
   */
  private _list: T[];
  /**
   * Indexes containing which items from the list and in which order they will be displayed
   */
  private _listMetadata: number[];
  
  protected _listCopy: T[];
  /**
   * Used for template bidirectional binding.
   */
  @Output() listChange = new EventEmitter<T[]>();

  /**
   * Used to show both options: 'confirm' and 'cancel'.
   */
  @Input() showOptionsTray = false;
  @Output() confirm = new EventEmitter<T[]>();
  @Output() cancel = new EventEmitter<T[]>();

  /**
   * Emits the item's original position and its new position
   */
  @Output() itemMoved = new EventEmitter<MoveEvent>();
  @Input() descriptionProperty: string;
  @Input() idProperty: string;
  @Input() fixedHeight = false;
  reorderGroupHeight: number;
  loading: boolean;

  constructor(
    private platform: Platform
  ) { 
  }

  get list() {
    return this._list;
  }
  @Input()
  set list(list: T[]) {
    this._list = list;
  }
  get listCopy() {
    return this._listCopy;
  }

  public get listMetadata(): number[] {
    return this._listMetadata;
  }
  @Input()
  public set listMetadata(listMetadata: number[]) {
    this._listMetadata = listMetadata;
  }

  ngOnInit() {
    this.loading = true;
    if(this.fixedHeight) {
      this.reorderGroupHeight = this.platform.height() - 200;
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this._listCopy = this.listMetadata ? this.listMetadata.map(position => this.list[position]) : [...this.list];
      this.loading = false;
    });
  }

  handleReorderEvent(event: Event): void {
    const evtDetail = (event as CustomEvent).detail;
    try {
      this.itemMoved.emit({from: evtDetail.from, to: evtDetail.to});
      evtDetail.complete(this._listCopy);
    } catch (error) {
      evtDetail.complete();
      console.log(error);
    }
    this.listChange.emit(this._listCopy);
  }

}
