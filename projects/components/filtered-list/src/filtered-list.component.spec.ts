import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilteredListComponent } from './filtered-list.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FilteredListComponent', () => {
    let component: FilteredListComponent;
    let fixture: ComponentFixture<FilteredListComponent>;
    const listMock = [{ id: 1, name: 'Item A', note: 'Note A' }, { id: 2, name: 'Item B', note: 'Note B' },
        { id: 3, name: 'a Item C', note: 'Note C' }];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilteredListComponent],
            imports: [IonicModule.forRoot(), ReactiveFormsModule],
            teardown: { destroyAfterEach: false }
        }).compileComponents();
        fixture = TestBed.createComponent(FilteredListComponent);
        component = fixture.componentInstance;
        component.idProperty = 'id';
        component.descriptionProperty = 'name';
        component.noteProperty = 'note';
        component.inputLabel = 'Name';
        component.list = listMock;
    });

    function readPropertiesAndAwaitRendering() {
        fixture.detectChanges(); // `oninit` and `onafterviewinit` are called; as viewchild.static is default/false, on afterviewinit itemTemplateRef and staticListTemplateRef are read
        return new Promise<void>((resolve) => setTimeout(() => {
            fixture.detectChanges(); // each #itemTemplateRef is rendered, as created during `createView` execution
            resolve();
        }, 1000)); // wait so timeout inside `afterviewinit` is executed
    }

    it('should load templates and component', async () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.itemTemplateRef).toBeTruthy();
        expect(component.staticListTemplateRef).toBeTruthy();
    });

    describe(':: load input if filtering supported ::', () => {

        it('should load input label', () => {
            fixture.detectChanges();
            const input = fixture.debugElement.query(By.css('#filter-input'));
            expect(input).toBeTruthy();
            console.log(input.nativeElement)
            expect(input.nativeElement.getAttribute('label')).toEqual('Name: ');
        });

        it('should display an error message if the input value is invalid', () => {
            fixture.detectChanges();
            const invalidValue = 'invalid-value';
            const error = { 'invalid': {} };
            const errorType = Object.keys(error)[0];
            component.constraints = [{ type: errorType, message: 'Invalid value', validator: () => error }];
            fixture.detectChanges();
            component.fg.get('description').setValue(invalidValue);
            fixture.detectChanges();
            const errorElement = fixture.nativeElement.querySelector('ion-text[color="danger"]');
            expect(errorElement).toBeTruthy();
            expect(errorElement.textContent).toContain(component.constraints[0].message);
        });
    });

    describe(':: render views ::', () => {

        it('should call createView X times', async () => {
            fixture.detectChanges();
            spyOn(component, 'createView').and.callThrough();
            await readPropertiesAndAwaitRendering();
            expect(component.createView).toHaveBeenCalledTimes(listMock.length);
        });
    });

    describe(':: static search ::', () => {
        beforeEach(() => {
            component.mode = 'static';
        });

        it('should display 3 items in default order', async () => {
            await readPropertiesAndAwaitRendering();
            const items = fixture.debugElement.queryAll(By.css('.item-inner'));
            expect(items.length).toBe(3);
            const itemALabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemALabel).toEqual('Item A');
            const itemBLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[2].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
        });

        it('should display 3 items in custom order', async () => {
            component.listMetadata = [1,2,0];
            await readPropertiesAndAwaitRendering();
            
            const items = fixture.debugElement.queryAll(By.css('.item-inner'));
            expect(items.length).toBe(3);
            const itemBLabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
            const itemALabel = items[2].nativeElement.querySelector('ion-label').textContent
            expect(itemALabel).toEqual('Item A');
        });

        it('should apply initial filter', async () => {
            component.listMetadata = [1,2];
            await readPropertiesAndAwaitRendering();

            const items = fixture.debugElement.queryAll(By.css('.item-inner'));
            expect(items.length).toBe(2);
            const itemBLabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
        });

        it('should apply a search filter on input change', () => {
            const filterValueMock = 'item';
            component.searchValue(filterValueMock);
            expect(component.userFilterValue).toBe(filterValueMock);
        });

        it('should display only filtered items', async () => {
            spyOn(component, 'searchValue').and.callThrough();
            await readPropertiesAndAwaitRendering();// render test's initial 3 items
            
            // input new value for filter
            const input = fixture.nativeElement.querySelector('ion-input');
            expect(input).toBeTruthy();
            input.value = 'A';
            input.dispatchEvent(new Event('ionInput'));
            expect(component.searchValue).toHaveBeenCalledWith('A');
            expect(component.userFilterValue).toEqual('A');
            
            await readPropertiesAndAwaitRendering();
            // check new item is displayed
            const itemList = fixture.debugElement.queryAll(By.css('.item-inner'));
            expect(itemList.length).toEqual(2);
            const itemBLabel = itemList[0].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item A');
            const itemCLabel = itemList[1].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
        });

        it('should add a new value to the list on click when allowNewValue is true', async () => {
            spyOn(component, 'sendValue').and.callThrough();
            const valueToAdd = 'New Value';
            component.allowNewValue = true;
            await readPropertiesAndAwaitRendering();

            component.valueSelected.subscribe(value => {
                expect(value).toEqual({ index: -1, value: valueToAdd });
            });
            // input new value
            component.fg.get('description').setValue(valueToAdd);
            fixture.detectChanges();
            // check new item is displayed
            const itemList = fixture.debugElement.queryAll(By.css('.item-inner'));
            expect(itemList.length).toEqual(4);
            // first item is the new item
            expect(itemList[0].nativeElement.textContent.trim()).toEqual('New Value');

            // check send new value
            itemList[0].nativeElement.click();
            fixture.detectChanges();
            expect(component.sendValue).toHaveBeenCalled();
        });

        it('should add and remove items', async () => {
            const insertionPosition = 0;
            component.list = [...listMock];
            await readPropertiesAndAwaitRendering();
          
            // Add item
            let itemId = 4;
            let newItem = { id: itemId, name: 'Item D', note: 'Note D' };
            component.addItem(newItem);
            await readPropertiesAndAwaitRendering();
            let items = fixture.debugElement.queryAll(By.css(`ion-item-sliding`));
            expect(items.length).toBe(listMock.length + 1);
            expect(items[insertionPosition].nativeElement.id).toEqual(itemId.toString());
            expect(component.list[insertionPosition]).toEqual(newItem);
            expect(component.list.length).toBe(listMock.length + 1);
               
            // Remove item
            component.removeItem(newItem.id.toString());
            await readPropertiesAndAwaitRendering();
            items = fixture.debugElement.queryAll(By.css(`ion-item-sliding`));
            expect(items.length).toBe(listMock.length);
            const removedItem = items.find(item => item.nativeElement.id === itemId);
            expect(removedItem).toBeFalsy();
            expect(component.list.length).toBe(listMock.length);
            
            // Add item again
            itemId = 5;
            newItem = { id: itemId, name: 'Item E', note: 'Note E' };
            component.addItem(newItem);
            await readPropertiesAndAwaitRendering();
            items = fixture.debugElement.queryAll(By.css(`ion-item-sliding`));
            expect(items.length).toBe(listMock.length + 1);
            expect(items[insertionPosition].nativeElement.id).toEqual(itemId.toString());
            expect(component.list[insertionPosition]).toEqual(newItem);
            expect(component.list.length).toBe(listMock.length + 1);
        });
          
    });

    describe(':: dynamic search ::', () => {
        it('should call the fetchValuesFn method on input change when mode is dynamic', () => {
            component.fetchValuesFn = (_) => of([]);
            const fetchValuesFnSpy = spyOn(component, 'fetchValuesFn').and.callThrough();
            component.mode = 'dynamic';
            const filterValue = '12345';
            fixture.detectChanges();
            component.searchValue(filterValue);
            expect(fetchValuesFnSpy).toHaveBeenCalledWith(filterValue);
        });
    });
});
