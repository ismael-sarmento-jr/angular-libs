import { 
  AfterViewInit, Component, ElementRef, EmbeddedViewRef, EventEmitter, 
  Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef 
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppError } from 'ionic-angular-components/error-handler';
import { Constraint } from 'ionic-angular-components/validation';
import { IonItemSliding, Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';

export interface ItemOption {
  icon: string;
  color?: string;
  handler: (value: any, index?: number) => void;
}

export interface SelectedItem {
  index: number;
  value: any;
}

@Component({
  selector: 'app-filtered-list',
  templateUrl: './filtered-list.component.html',
  styleUrls: ['./filtered-list.component.scss']
})
export class FilteredListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('filterInput') filterInput;
  @ViewChild('staticListTemplateRef', { read: ViewContainerRef }) staticListTemplateRef: ViewContainerRef;
  @ViewChild('itemTemplateRef', { read: TemplateRef }) itemTemplateRef: TemplateRef<any>;
  @Input() mode: 'static' | 'dynamic' = 'static';
  /**
   * Indicates if typed value is added to displayed list
   */
  @Input() allowNewValue = false;
  @Input() allowFiltering = true;
  /**
   * Object property to be compared with input filter
   */
  @Input() options: ItemOption[];
  @Input() dynamicList$: Observable<any[]>;
  
  /**
   * List to be displayed
   */
  private _list: any[];
  /**
   * Indexes containing which items from the list and in which order they will be displayed
   */
  private _listMetadata: number[];
  
  /**
   * Value typed by user in the filter input; applied prior rendering the each item.
   */
  private _userFilterValue: string;

  /*
   * Properties in the items's value to be displayed
   */
  @Input() idProperty: string;
  @Input() descriptionProperty: string;
  @Input() noteProperty: string;
  
  @Input() inputLabel: string;
  @Input() fetchValuesFn: (filterValue: string) => Observable<any>;
  @Input() limit: number;
  @Input() validateInput = false;
  @Input() autoFocus = false;
  private _constraints: Constraint[];
  @Input() fixedHeight = false;
  @Output() valueSelected: EventEmitter<SelectedItem> = new EventEmitter<SelectedItem>();

  fg = new FormGroup({ description: new FormControl('') });
  /**
   * The last filtered (values list) input
  */
  bufferInput: string;
  /**
   * The last searched (server) input
  */
  lastSearchedInput: string;
  listHeight: number;
  loading: boolean;

  constructor(
    private _elementRef: ElementRef,
    private _platform: Platform
  ) {
    this.loading = true;
  }

  get list() {
    return this._list;
  }
  @Input()
  set list(list: any[]) {
    this._list = list;
    this.progressiveRenderItems(this.list);
  }
  get userFilterValue() {
    return this._userFilterValue;
  }
  set userFilterValue(filterValue: string) {
    this._userFilterValue = filterValue;
    this.progressiveRenderItems(this.list);
  }
  public get constraints(): Constraint[] {
    return this._constraints;
  }
  @Input()
  public set constraints(constraints: Constraint[]) {
    this._constraints = constraints;
    this.addValidators(constraints);
  }

  public get listMetadata(): number[] {
    return this._listMetadata;
  }
  @Input()
  public set listMetadata(listMetadata: number[]) {
    this._listMetadata = listMetadata;
  }

  ngOnInit() {
    if (this.fixedHeight) {
      this.listHeight = this._platform.height() - 300;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.autoFocus) {
        this.filterInput?.setFocus();
      }
      this.addValidators(this.constraints);
    }, 500);
    this.progressiveRenderItems(this.list);
  }

  ngOnDestroy(): void {
    this.staticListTemplateRef.clear(); // this is enough to GC created views, no need to destroy them one by one
    this.list = null;
  }

  addValidators(constraints: Constraint[]) {
    if (!constraints) {
      return;
    }
    const validators = constraints.map(constraint => constraint.validator);
    const description = this.fg.get('description');
    description.setValidators(validators);
    description.updateValueAndValidity();
  }

  async openItem(slidingItem: IonItemSliding) {
    if(this.options?.length > 0 ) {
      await slidingItem.open('end');
    }
  }
  removeItem(id: string): void {
    const htmlItems = [...this._elementRef.nativeElement.querySelectorAll(`ion-item-sliding`)];
    const itemIndex = htmlItems.findIndex(el => el.id === id);
    const viewRef = this.staticListTemplateRef.get(itemIndex);
    if(viewRef) {
      // animate
      const htmlItem = htmlItems[itemIndex];
      htmlItem.classList.remove('item-added');
      htmlItem.classList.add('item-removed');
      // then remove
      setTimeout(() => {
        viewRef.destroy();
        this.list.splice(itemIndex, 1);
      }, 500);
    }
  }
  addItem(value: any, listIndex?: number): void {
    const viewIndex = 0;
    const context = { value, listIndex, classList: 'item-added' };
    const viewRef: EmbeddedViewRef<any> = this.staticListTemplateRef.createEmbeddedView(this.itemTemplateRef, context, {index: viewIndex});
    if(viewRef) {
      setTimeout(() => {
        viewRef.rootNodes[0].classList.add('displayed')
        this.list.splice(viewIndex, 0, value);
      });
    }
  }

  /**
   * Emits the value and the index in the original list, that is, whithout filters applied
   * 
   * @param value value to be searched in the list
   */
  sendValue(value: any) {
    const index = this.list.findIndex(item => item === value);
    this.valueSelected.emit({ index, value });
  }

  progressiveRenderItems(list: any[]): void {
    if (!list) {
      return;
    }
    if (list.length === 0) {
      this.loading = false;
      return;
    }
    if (this.staticListTemplateRef) {
      this.staticListTemplateRef.clear();
    } else {
      return;
    }

    const chunkSize = 5;
    let currentIndex = 0;
    const listMetadata = this.listMetadata || [...Array(this.list.length).keys()];
    const interval = setInterval(() => {
      const nextIndex = currentIndex + chunkSize;
      for (let n = currentIndex; n < nextIndex; n++) {
        if (n >= list.length || n >= this.limit) {
          clearInterval(interval);
          break;
        }
        try {
          this.createView(listMetadata[n], list);
        } catch (error) {
          clearInterval(interval);
          throw new AppError(error, false);
        }
        this.loading = false;
      }
      currentIndex += chunkSize;
    }, 10);
  }

  createView(index: number, list: any[]): void {
    const value = list[index];
    if(value == null) {
      return;
    }
    if (
      (!this.userFilterValue || value[this.descriptionProperty]?.toLowerCase().includes(this.userFilterValue.toLowerCase())) // check user input filter
    ) {
      const context = { index, value };
      this.staticListTemplateRef.createEmbeddedView(this.itemTemplateRef, context);
    }
  }

  /**
   * Finds values on server given filterValue, from number of 'minChars' typed.
   * Filter values list if typed less than 'minChars' characters.
   * If filterValue length is zero, resets search.
   */
  async searchValue(filterValue: string) {
    if (this.mode === 'dynamic') {
      this.dynamicSearchValue(filterValue);
    } else {
      this.userFilterValue = filterValue;
    }
  }

  async dynamicSearchValue(filterValue: string) {
    if (!this.bufferInput?.includes(filterValue)) {
      this.bufferInput = filterValue;
    }
    const minChars = 5;
    if (filterValue.length >= minChars && filterValue !== this.lastSearchedInput) {
      await this.dynamicListValues(filterValue);
    }
    else {
      this.resetDynamicSearch();
    }
  }

  /**
   * Finds values on server and filter them
   */
  async dynamicListValues(filterValue: string) {
    this.dynamicList$ = this.fetchValuesFn(filterValue);
  }

  private resetDynamicSearch() {
    this.dynamicList$ = of([]);
    this.bufferInput = '';
  }
}
