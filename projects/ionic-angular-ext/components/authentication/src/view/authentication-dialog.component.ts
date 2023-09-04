import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
    selector: 'authentication-dialog',
    templateUrl: './authentication-dialog.component.html',
    styleUrls: ['./authentication-dialog.component.scss']
})
export class AuthenticationDialogComponent {

    authService: AuthenticationService;

    constructor(
        private router: Router,
        // private matIconReg: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        // redirect to dashboard if already logged in
        this.authService.currentUser$.subscribe(user => {
            if(user && user.nickname) {
                this.router.navigate(['/dashboard']);
            }
        });

        /*this.matIconReg
        .addSvgIcon(
            "facebook",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/drawable-xhdpi/facebook.svg")
        )
        .addSvgIcon(
            "google",
            this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/drawable-xhdpi/google.svg")
        );*/
    }

}
