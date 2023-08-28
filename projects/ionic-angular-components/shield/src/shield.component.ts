import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shield',
  templateUrl: './shield.component.html',
  styleUrls: ['./shield.component.scss'],
})
export class ShieldComponent implements OnInit {

  /**
   * Font size in pixels
   */
  @Input() size: number;
  /**
   * Background color name
   */
  @Input() color: string;

  constructor() { }

  ngOnInit() {}

}
