import { TestBed } from '@angular/core/testing';
import { AlertButton, AlertController } from '@ionic/angular';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let alertController: AlertController;
  let alertSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService, AlertController
      ],
    });
    service = TestBed.inject(ConfirmDialogService);
    alertController = TestBed.inject(AlertController);
    alertSpy = spyOn(alertController,'create').and.returnValue(Promise.resolve({
      present: () => {},
      onDidDismiss: () => {},
    } as any));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should present a dialog with the correct message', async () => {
    const message = 'Are you sure you want to delete this item?';
    const onConfirm = jasmine.createSpy('onConfirm');
    const onCancel = jasmine.createSpy('onCancel');
    await service.presentDialog(message, onConfirm, onCancel);
    const options = {
      message,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: onCancel,
        },
        {
          text: 'Sim',
          role: 'confirm',
          handler: onConfirm,
        },
      ],
    };
    expect(alertController.create).toHaveBeenCalledWith(options);
  });

  describe(':: handlers ::', () => {

    it('should call the onConfirm handler when the "Sim" button is clicked', async () => {
      const message = 'Are you sure you want to delete this item?';
      const onConfirm = jasmine.createSpy('onConfirm');
      const onCancel = jasmine.createSpy('onCancel');
      const alertPromise = service.presentDialog(message, onConfirm, onCancel);
      const { buttons } = alertSpy.calls.first().args[0];
      (buttons.find(btn => btn.role === 'confirm') as AlertButton).handler(null);
      await alertPromise;
      expect(onConfirm).toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });
  
    it('should call the onCancel handler when the "Não" button is clicked', async () => {
      const message = 'Are you sure you want to delete this item?';
      const onConfirm = jasmine.createSpy('onConfirm');
      const onCancel = jasmine.createSpy('onCancel');
      const alertPromise = service.presentDialog(message, onConfirm, onCancel);
      const { buttons } = alertSpy.calls.first().args[0];
      (buttons.find(btn => btn.role === 'cancel') as AlertButton).handler(null);
      await alertPromise;
      expect(onConfirm).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });
  });
});
