import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { ConfirmDialogService } from '@ionic-angular-ext/components/confirm-dialog';
import { DateTimeService } from '@ionic-angular-ext/components/api';
import { StopwatchComponent } from './stopwatch.component';
import { Stopwatch } from './stopwatch';

describe('StopwatchComponent', () => {
  let component: StopwatchComponent;
  let fixture: ComponentFixture<StopwatchComponent>;
  let confirmDialogService: ConfirmDialogService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StopwatchComponent ],
      providers: [
        AlertController,
        ConfirmDialogService,
        DateTimeService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopwatchComponent);
    component = fixture.componentInstance;
    component.stopwatch = new Stopwatch();
    confirmDialogService = TestBed.inject(ConfirmDialogService);
    fixture.detectChanges();
  });

  it('should start the stopwatch on play icon click', () => {
    spyOn(component.stopwatch, 'startOrResume');
    fixture.debugElement.query(By.css('ion-icon[name="play"]')).nativeElement.click();
    expect(component.stopwatch.startOrResume).toHaveBeenCalled();
  });

  it('should show the stop icon after starting the stopwatch', () => {
    component.stopwatch.startOrResume();
    fixture.detectChanges();
    const stopIcon = fixture.debugElement.query(By.css('ion-icon[name="stop"]'));
    expect(stopIcon).toBeTruthy();
  });

  it('should confirm stop watch when stop icon is clicked', async () => {
    spyOn(confirmDialogService, 'presentDialog').and.returnValue(Promise.resolve({ onDidDismiss: () => {} } as HTMLIonAlertElement));
    spyOn(component.stopwatch, 'stop');
    component.stopwatch.startOrResume();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100)); // add a delay before clicking the stop icon; using fakeAsync and tick keeps giving errors of limited number of tasks
    fixture.debugElement.query(By.css('ion-icon[name="stop"]')).nativeElement.click();
    expect(confirmDialogService.presentDialog).toHaveBeenCalled();
  });
});
