import {Component, Input} from '@angular/core';
import { AlertController } from '@ionic/angular';
import {Stopwatch} from './stopwatch';
import {ConfirmDialogService} from '@ionic-angular-ext/components/confirm-dialog';
import { DateTimeService } from '@ionic-angular-ext/components/api';


/**
 * Holds a stopwatch instance and provides a visual representation
 * for the watch, with its start/stop options.
 */
@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent {

  @Input() stopwatch: Stopwatch;

  constructor(
    public alertController: AlertController,
    private confirmDialogService: ConfirmDialogService,
    public dateTimeService: DateTimeService
  ) {
  }

  startWatch(): void {
    if(!this.stopwatch.startTime) {
      this.stopwatch.startOrResume();
    }
  }

  async stopWatch(askConfirmation = true): Promise<void> {
    if(askConfirmation) {
      const confirmDialog = await this.confirmDialogService.presentDialog('Finalizar partida?',
        () => this.stopwatch.stop());
      await confirmDialog.onDidDismiss();
    } else {
      this.stopwatch.stop();
    }
  }

}
