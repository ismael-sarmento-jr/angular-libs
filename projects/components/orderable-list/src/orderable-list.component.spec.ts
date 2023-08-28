import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { OrderableListComponent } from './orderable-list.component';

type TestItem = { id: number; name: string; note: string };
const listMock = [{ id: 1, name: 'Item A', note: 'Note A' }, { id: 2, name: 'Item B', note: 'Note B' },
    { id: 3, name: 'a Item C', note: 'Note C' }];

describe('OrderableListComponent', () => {
    let component: OrderableListComponent<TestItem>;
    let fixture: ComponentFixture<OrderableListComponent<TestItem>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderableListComponent],
            imports: [IonicModule.forRoot()],
            teardown: { destroyAfterEach: false }
        }).compileComponents();
        fixture = TestBed.createComponent(OrderableListComponent<TestItem>);
        component = fixture.componentInstance;
        component.list = listMock;
        component.descriptionProperty = 'name';
        fixture.detectChanges();
    });

    function reRenderItems() {
        return new Promise<void>((resolve) => setTimeout(() => {
            fixture.detectChanges();
            resolve();
        }, 1000));
    }

    it('should load component', async () => {
        expect(component).toBeTruthy();
    });

    describe(':: initial render ::', () => {

        it('should display 3 items in default order', async () => {
            await reRenderItems();
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toBe(3);
            const itemALabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemALabel).toEqual('Item A');
            const itemBLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[2].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
        });
    
        it('should display 3 items in initial order', async () => {
            component.listMetadata = [1,2,0];
            await reRenderItems();
            
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toBe(3);
            const itemBLabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
            const itemALabel = items[2].nativeElement.querySelector('ion-label').textContent
            expect(itemALabel).toEqual('Item A');
        });
    
        it('should apply initial order and filter', async () => {
            component.listMetadata = [1,2];
            await reRenderItems();
    
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toBe(2);
            const itemBLabel = items[0].nativeElement.querySelector('ion-label').textContent
            expect(itemBLabel).toEqual('Item B');
            const itemCLabel = items[1].nativeElement.querySelector('ion-label').textContent
            expect(itemCLabel).toEqual('a Item C');
        });
    });

    describe(':: reorder ::', () => {

        function completeMock(from: number, to: number) {
            return (list) => {
                const item = list.splice(from, 1)[0];
                list.splice(to, 0, item);
            }
        }

        it('should move item from 0 to 2', async () => {
            await reRenderItems();
            spyOn(component, 'handleReorderEvent').and.callThrough();
            spyOn(component.itemMoved, 'emit');
            spyOn(component.listChange, 'emit');
    
            const el = fixture.debugElement.query(By.css('ion-reorder-group'));
            const event = {
                detail: {
                  from: 0,
                  to: 2,
                  complete: completeMock(0, 2)
                }
            };
            el.triggerEventHandler('ionItemReorder', event);
            
            expect(component.handleReorderEvent).toHaveBeenCalled();
            expect(component.itemMoved.emit).toHaveBeenCalledWith({ from: 0, to: 2 });
            expect(component.listChange.emit).toHaveBeenCalledWith(component.listCopy);
    
            await reRenderItems();
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toEqual(3);
            expect(items[0].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[1][component.descriptionProperty]);
            expect(items[1].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[2][component.descriptionProperty]);
            expect(items[2].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[0][component.descriptionProperty]);
        });

        it('should move item in pre ordered list', async () => {
            component.listMetadata = [1,0,2];
            await reRenderItems();
            spyOn(component, 'handleReorderEvent').and.callThrough();
            spyOn(component.itemMoved, 'emit');
            spyOn(component.listChange, 'emit');
    
            const el = fixture.debugElement.query(By.css('ion-reorder-group'));
            const event = {
                detail: {
                  from: 0,
                  to: 2,
                  complete: completeMock(0, 2)
                }
            };
            el.triggerEventHandler('ionItemReorder', event);
            
            expect(component.handleReorderEvent).toHaveBeenCalled();
            expect(component.itemMoved.emit).toHaveBeenCalledWith({ from: 0, to: 2 });
            expect(component.listChange.emit).toHaveBeenCalledWith(component.listCopy);
    
            await reRenderItems();
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toEqual(3);
            expect(items[0].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[0][component.descriptionProperty]);
            expect(items[1].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[2][component.descriptionProperty]);
            expect(items[2].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[1][component.descriptionProperty]);
        });

        xit('should move item in pre ordered and filtered list', async () => {
            component.listMetadata = [0,2];
            await reRenderItems();
            spyOn(component, 'handleReorderEvent').and.callThrough();
            spyOn(component.itemMoved, 'emit');
            spyOn(component.listChange, 'emit');
    
            const el = fixture.debugElement.query(By.css('ion-reorder-group'));
            const event = {
                detail: {
                  from: 0,
                  to: 1,
                  complete: completeMock(0, 1)
                }
            };
            el.triggerEventHandler('ionItemReorder', event);
            
            expect(component.handleReorderEvent).toHaveBeenCalled();
            expect(component.itemMoved.emit).toHaveBeenCalledWith({ from: 0, to: 1 });
            expect(component.listChange.emit).toHaveBeenCalledWith(component.listCopy);
    
            await reRenderItems();
            const items = fixture.debugElement.queryAll(By.css('.orderable-item'));
            expect(items.length).toEqual(2);
            expect(items[0].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[2][component.descriptionProperty]);
            expect(items[1].nativeElement.querySelector('ion-label').textContent).toEqual(listMock[0][component.descriptionProperty]);
        });

    });
      
});
