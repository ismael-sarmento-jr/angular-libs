import { IonicModule, ModalController } from '@ionic/angular';
import { ModalService } from './modal.service';
import { TestBed } from '@angular/core/testing';

import { Component, ViewChild, TemplateRef} from '@angular/core';

@Component({
  template: `<input #inputElement type="text" id="modal-input" />`
})
export class TestComponent {
  @ViewChild('inputElement') template: TemplateRef<HTMLInputElement>;
}

describe('ModalService', () => {
  let service: ModalService;
  let modalController: ModalController;
  let modal: HTMLIonModalElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [ TestComponent ]
    });
    modalController = TestBed.inject(ModalController);
    service = new ModalService(modalController);

    modal = {
      present: () => {},
      onWillDismiss: () => Promise.resolve({}),
      querySelector: (_) => document.querySelector('input')
    } as HTMLIonModalElement;
    spyOn(modalController, 'create').and.returnValue(Promise.resolve(modal));
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return false if there is no open modal', () => {
    const result = service.hasOpenModal();
    expect(result).toBe(false);
  });

  it('should return true if there is an open modal', () => {
    service['_modal'] = {} as HTMLIonModalElement;
    const result = service.hasOpenModal();
    expect(result).toBe(true);
  });

  it('should create a modal if presentModal is called with a valid template and no open modal', async () => {
    const template: any = {};
    const result = await service.presentModal(template);
    expect(result).toBeDefined();
    expect(modalController.create).toHaveBeenCalledWith({
      component: jasmine.any(Function),
      cssClass: ['modal'],
      backdropDismiss: false,
      componentProps: {template},
    });
  });

  it('should not create a modal there is already an open modal', async () => {
    const template: any = {};
    service['_modal'] = modal;
    const result = await service.presentModal(template);
    expect(result).toBeDefined();
    expect(modalController.create).not.toHaveBeenCalled();
  });

  it('should set focus on the input element if presentModal is called with autoFocus=true', async () => {
    const comptFixure = TestBed.createComponent(TestComponent);
    const testCompt = comptFixure.componentInstance;
    comptFixure.detectChanges();
    const template = testCompt.template;

    await service.presentModal(template, true);
    await new Promise(resolve => {
      template['nativeElement'].addEventListener('focus', async () => {
        // check that focus is in the input
        expect(document.activeElement === template['nativeElement']).toBeTrue();
        resolve({});
      });
    });
  });

  it('should dismiss the modal and reset the _modal variable if closeModal is called', async () => {
    spyOn(modalController,'dismiss').and.returnValue(Promise.resolve(true));
    
    const result = await service.closeModal();
    
    expect(result).toBe(true);
    expect(modalController.dismiss).toHaveBeenCalledWith(undefined);
    expect(service['_modal']).toBeNull();
  });

});
