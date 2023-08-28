import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the cardClosed event when closeCard is called', () => {
    spyOn(component.cardClosed, 'emit');
    component.closeCard();
    expect(component.cardClosed.emit).toHaveBeenCalled();
  });

  it('should set loading to true when showLoadingIndicator is called', () => {
    component.showLoadingIndicator();
    expect(component.loading).toBeTrue();
  });

  it('should set loading to false when hideLoadingIndicator is called', () => {
    component.hideLoadingIndicator();
    expect(component.loading).toBeFalse();
  });

  it('should render title with correct text', () => {
    const title = 'Test Title';
    component.title = title;
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('.card-title span'));
    expect(titleElement.nativeElement.textContent.trim()).toBe(title);
  });

  it('should render subtitle with correct text', () => {
    const subtitle = 'Test Subtitle';
    component.subtitle = subtitle;
    fixture.detectChanges();
    const subtitleElement = fixture.debugElement.query(By.css('.card-subtitle h4'));
    expect(subtitleElement.nativeElement.textContent.trim()).toBe(subtitle);
  });

  it('should render close icon when closeable is true', () => {
    component.closeable = true;
    fixture.detectChanges();
    const closeIcon = fixture.debugElement.query(By.css('.card-title ion-icon[name="close"]'));
    expect(closeIcon).toBeTruthy();
  });

  it('should not render close icon when closeable is false', () => {
    component.closeable = false;
    fixture.detectChanges();
    const closeIcon = fixture.debugElement.query(By.css('.card-title ion-icon[name="close"]'));
    expect(closeIcon).toBeFalsy();
  });
});
