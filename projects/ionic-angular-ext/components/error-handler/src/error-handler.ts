import { ErrorHandler } from '@angular/core';
import { AppToastService } from '@ionic-angular-ext/components/toast';

export class SimpleErrorHandler implements ErrorHandler {

    constructor(
        private toastService: AppToastService
    ) {}

    handleError(error: any): void {
        error = error.rejection ? error.rejection : error;
        if(error.isOperational) {
            this.toastService.presentToast(error.message);
            console.log(error);
        } else {
            console.log(error);
        }
    }

}
