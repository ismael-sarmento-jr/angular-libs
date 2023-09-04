import { ValidatorFn } from '@angular/forms';

export interface Constraint {
    type: string;
    validator: ValidatorFn;
    message: string;
 }
