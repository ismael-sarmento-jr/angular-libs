import { TemplateRef } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'ionic-angular-components/modal';
import { DateTimeService } from 'ionic-angular-components/api';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent implements OnInit {

  @ViewChild('ionDatetime') ionDatetime: TemplateRef<IonDatetime>;
  @Input() minDate: string;
  @Input() maxDate: string;
  @Output() valueSelected = new EventEmitter<string>();

  month: string;
  year: number;
  initialValue: string;
  selectedDate: string;
  months= ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  constructor(
    private dateTimeService: DateTimeService,
    public modalService: ModalService
  ) { }

  ngOnInit() {
    const currentDate = new Date();
    this.month = this.months[currentDate.getMonth()];
    this.year = currentDate.getFullYear();
    this.initialValue = this.dateTimeService.fromDateToStandardDateStr(currentDate);
    this.selectedDate = this.initialValue;
  }

  public async open() {
    const evt = await this.modalService.presentModal(this.ionDatetime);
    if(evt.data) {
      const dateValue = this.dateTimeService.fromDateToStandardDateStr(new Date(evt.data.detail.value));
      this.valueSelected.emit(dateValue);
    }
  }
}
