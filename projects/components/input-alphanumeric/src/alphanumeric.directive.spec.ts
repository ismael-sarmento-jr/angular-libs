import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlphanumericDirective } from './alphanumeric.directive';

@Component({
  template: '<input type="text" alphanumeric>'
})
class TestComponent {}

describe('AlphanumericDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, AlphanumericDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should allow input that is alphanumeric and has one space between words', () => {
    inputEl.value = 'Hello 123 World';
    inputEl.dispatchEvent(new Event('ionInput'));
    fixture.detectChanges();
    expect(inputEl.value).toEqual('Hello 123 World');
  });

  it('should allow only letters at the beginning of the string', () => {
    inputEl.value = '2Hello World';
    inputEl.dispatchEvent(new Event('ionInput'));
    fixture.detectChanges();
    expect(inputEl.value).toEqual('Hello World');
  });

  it('should remove any non-alphanumeric characters', () => {
    inputEl.value = '!@#Hello 123 World%^&*()';
    inputEl.dispatchEvent(new Event('ionInput'));
    fixture.detectChanges();
    expect(inputEl.value).toEqual('Hello 123 World');
  });

  it('should remove extra whitespace characters at the end', () => {
    inputEl.value = 'Hello 123 World    ';
    inputEl.dispatchEvent(new Event('ionInput'));
    fixture.detectChanges();
    expect(inputEl.value).toEqual('Hello 123 World ');
  });

  it('should remove any whitespace characters after a single whitespace', () => {
    inputEl.value = 'Hello    123   World';
    inputEl.dispatchEvent(new Event('ionInput'));
    fixture.detectChanges();
    expect(inputEl.value).toEqual('Hello 123 World');
  });
});
