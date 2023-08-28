import { ComponentFixture, TestBed} from '@angular/core/testing';
import { AlertButton, AlertController, IonicModule, NavController, Platform, PopoverController } from '@ionic/angular';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { PageComponent, HeaderButton } from './page.component';
import { Action } from './page-menu.component';
import { By } from '@angular/platform-browser';
import { SharedTestModule } from '../shared.test.module';
import { ModalService } from '../modal/modal.service';
import { Subscription } from 'rxjs';


const headerButtons: HeaderButton[] = [
    { title: 'button1', icon: 'icon1', handler: () => { } },
    { title: 'button2', icon: 'icon2', handler: () => { } }
];
const headerMenuActions: Action[] = [
    { title: 'action1', handler: () => Promise.resolve(), display: () => true },
    { title: 'action2', handler: () => Promise.resolve(), display: () => false }
];
const platformMock = {
    backButton: {
        subscribeWithPriority: (_, __) => {}
    }
}

describe('PageComponent', () => {
    let component: PageComponent;
    let comptFixture: ComponentFixture<PageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageComponent],
            providers: [ConfirmDialogService, NavController, PopoverController,
                { provide: Platform, useValue: platformMock }],
            imports: [IonicModule, SharedTestModule]
        }).compileComponents();

        comptFixture = TestBed.createComponent(PageComponent);
        component = comptFixture.componentInstance;
        comptFixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe(':: Header ::', () => {

        it('should display the header title correctly', () => {
            const title = 'Test Title';
            component.title = title;
            comptFixture.detectChanges();
            const titleElement = comptFixture.debugElement.query(By.css('#page-header ion-title')).nativeElement;
            expect(titleElement.textContent).toEqual(title);
        });

        it('should display the header buttons correctly', () => {
            component.headerButtons = headerButtons;
            comptFixture.detectChanges();
            const buttonElements = comptFixture.debugElement.queryAll(By.css('#page-header ion-buttons ion-button'));
            expect(buttonElements.length).toEqual(headerButtons.length);
            for (let i = 0; i < headerButtons.length; i++) {
                expect(buttonElements[i].attributes['title']).toEqual(headerButtons[i].title);
                expect(buttonElements[i].query(By.css('ion-icon')).attributes['ng-reflect-name']).toEqual(headerButtons[i].icon);
            }
        });

        it('should not render header buttons when none are provided', () => {
            const headerBtns = comptFixture.debugElement.query(By.css('#page-header ion-buttons[slot="end"]'));
            expect(headerBtns).toBeFalsy();
        });

        it('should show header with title and no buttons or actions by default', () => {
            const header = comptFixture.nativeElement.querySelector('#page-header');
            const title = header.querySelector('.ion-text-capitalize');
            const startButtons = header.querySelectorAll('ion-buttons[slot="start"] ion-button');
            const endButtons = header.querySelectorAll('ion-buttons[slot="end"] ion-button');
            expect(header).toBeTruthy();
            expect(title.textContent).toBe('');
            expect(startButtons.length).toBe(0);
            expect(endButtons.length).toBe(0);
        });

        it('should show header with title and back button if `canGoBack` input is true', () => {
            component.canGoBack = true;
            comptFixture.detectChanges();
            const header = comptFixture.nativeElement.querySelector('#page-header');
            const title = header.querySelector('.ion-text-capitalize');
            const startButtons = header.querySelectorAll('ion-buttons[slot="start"] ion-button');
            const endButtons = header.querySelectorAll('ion-buttons[slot="end"] ion-button');
            expect(header).toBeTruthy();
            expect(title.textContent).toBe('');
            expect(startButtons.length).toBe(1);
            expect(startButtons[0].getAttribute('title')).toBe('Voltar');
            expect(endButtons.length).toBe(0);
        });
    });

    describe(':: Menu ::', () => {
        it('should call presentPopoverMenu when header menu button is clicked', () => {
            spyOn(component, 'presentPopoverMenu');
            component.headerMenuActions = headerMenuActions;
            comptFixture.detectChanges();
            const headerMenuBtn = comptFixture.debugElement.query(By.css('#page-header ion-buttons[slot=end] ion-button[title="Opções"]'));
            headerMenuBtn.nativeElement.click();
            expect(component.presentPopoverMenu).toHaveBeenCalled();
        });

        it('should create a new popover when headerMenuActions is set', async () => {
            spyOn(component, 'createHeaderPopoverMenu');
            component.headerMenuActions = headerMenuActions;
            comptFixture.detectChanges();
            expect(component.createHeaderPopoverMenu).toHaveBeenCalled();
        });

        it('should not create a new popover when headerMenuActions is unset', async () => {
            spyOn(component, 'createHeaderPopoverMenu');
            component.headerMenuActions = null;
            comptFixture.detectChanges();
            expect(component.createHeaderPopoverMenu).not.toHaveBeenCalled();
        });
    });

    describe(':: system/hardware Back Button ::', () => {
        let modalService: ModalService;
        let platform: Platform;

        beforeEach(() => {
            modalService = TestBed.inject(ModalService);
            platform = TestBed.inject(Platform);
            spyOn(platform.backButton, 'subscribeWithPriority').and.callFake((_, callback) => {
                callback(() => {});
                return new Subscription();
            });
            spyOn(modalService, 'closeModal');
            spyOn(component, 'goBack').and.callFake(() => Promise.resolve());
        });

        it('should navigate back if canGoBack is true and modalService does not have an open modal', () => {
            component.canGoBack = true;
            spyOn(modalService, 'hasOpenModal').and.returnValue(false);
            component.setupSystemBackButtonAction();
            expect(component.goBack).toHaveBeenCalled();
            expect(modalService.closeModal).not.toHaveBeenCalled();
        });

        it('should close modal if modalService has an open modal', () => {
            spyOn(modalService, 'hasOpenModal').and.returnValue(true);
            component.setupSystemBackButtonAction();
            expect(modalService.closeModal).toHaveBeenCalled();
            expect(component.goBack).not.toHaveBeenCalled();
        });

        it('should do nothing if no open modal and can\'t go back', () => {
            spyOn(modalService, 'hasOpenModal').and.returnValue(false);
            component.setupSystemBackButtonAction();
            expect(modalService.closeModal).not.toHaveBeenCalled();
            expect(component.goBack).not.toHaveBeenCalled();
        });
    });

    describe(':: app page Back button ::', () => {
        let navCtrl: NavController;
        let confirmationService: ConfirmDialogService;
        let alertController: AlertController;
        let alertSpy: jasmine.Spy;

        beforeEach(() => {
            navCtrl = TestBed.inject(NavController);
            spyOn(navCtrl, 'back').and.callFake(() => {});

            // mock alert controller in confirm service: ionic doesn't make this easy or straightforward 
            confirmationService = TestBed.inject(ConfirmDialogService);
            alertController = TestBed.inject(AlertController);
            alertSpy = spyOn(alertController,'create').and.returnValue(Promise.resolve({
                present: () => {},
                onDidDismiss: () => {},
            } as any));
        });

        it('should display the "Go Back" button when "canGoBack" is true', () => {
            component.canGoBack = true;
            comptFixture.detectChanges();
            const backButton = comptFixture.debugElement.query(By.css('ion-button[title="Voltar"]'));
            expect(backButton).not.toBeNull();
        });

        it('should not display the "Go Back" button when "canGoBack" is false', () => {
            component.canGoBack = false;
            comptFixture.detectChanges();
            const backButton = comptFixture.debugElement.query(By.css('ion-button[title="Voltar"]'));
            expect(backButton).toBeNull();
        });

        it('should presentDialog then the navigate back with "pendingChanges" false', () => {
            component.canGoBack = true;
            component.pendingChanges = false;
            comptFixture.detectChanges();

            const backButton = comptFixture.debugElement.query(By.css('ion-button[title="Voltar"]'));
            backButton.triggerEventHandler('click', null);
            expect(navCtrl.back).toHaveBeenCalled();
        });

        it('should presentDialog then the navigate back with pending changes, as user confirms navigation', () => {
            const confirmSpy = spyOn(confirmationService, 'presentDialog').and.callThrough();
            component.canGoBack = true;
            component.pendingChanges = true;
            comptFixture.detectChanges();

            const backButton = comptFixture.debugElement.query(By.css('ion-button[title="Voltar"]'));
            expect(backButton).toBeTruthy();
            backButton.triggerEventHandler('click', null);
            expect(confirmSpy).toHaveBeenCalled();

            const { buttons } = alertSpy.calls.first().args[0];
            (buttons.find(btn => btn.role === 'confirm') as AlertButton).handler(null);
            expect(navCtrl.back).toHaveBeenCalled();
        });
    });
});