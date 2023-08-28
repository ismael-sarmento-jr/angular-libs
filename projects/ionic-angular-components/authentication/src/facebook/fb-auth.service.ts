/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, of, EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthProvider, ProviderAuthResult } from '../service/auth';


@Injectable({ providedIn: 'root' })
export class FbAuthService implements AuthProvider {

    constructor(
        private router: Router
    ) {}

    /**
     * login with facebook and return observable with fb access token on success
     */
    login(): Promise<ProviderAuthResult> {
        return new Promise<ProviderAuthResult>((resolve, reject) => {
            FB.getLoginStatus(fbLoginResponse => {
                if (fbLoginResponse.status === 'connected' && fbLoginResponse.authResponse) {
                    resolve(this.fetchFbUserData(fbLoginResponse));
                } else {
                    resolve(this.doLoginAndFetchData());
                }
            });
        });
    }

    /**
     * Opens new fb login dialog and then fetches users data
     */
    doLoginAndFetchData(): Promise<ProviderAuthResult> {
        return this.initFbLogin().pipe(concatMap(fbLoginResponse => {
            if(fbLoginResponse.status === 'connected' && fbLoginResponse.authResponse) {
                return this.fetchFbUserData(fbLoginResponse);
            }
            return Promise.reject(`Couldn\'t connect; status: ${fbLoginResponse.status}; response: ${fbLoginResponse.authResponse}`);
        })).toPromise();
    }

    /**
     * Fetches user name and email.
     * As the user might not have given permission to scope email, that needs to be requested separately, because fb
     * only returns error message, if one of the fields is not available.
     *
     */
    fetchFbUserData(fbLoginResponse: facebook.StatusResponse): Promise<ProviderAuthResult> {
        const accessToken = fbLoginResponse.authResponse.accessToken;
        return Promise.all([
            this.fetchFBUserData(accessToken, ['name']).catch(e => e),
            this.fetchFBUserData(accessToken, ['email']).catch(e => e)
        ]).then(fbUserDataResponse => {
            const name = fbUserDataResponse[0] ? fbUserDataResponse[0]['name'] as string : undefined;
            const email = fbUserDataResponse[1] ? fbUserDataResponse[1]['email'] as string : undefined;
            return  {
                provider: 'facebook',
                token: accessToken,
                idInProvider: fbLoginResponse.authResponse.userID,
                name,
                email
            };
        });//TODO catch or throw new error
    }

    initFbLogin(): Observable<facebook.StatusResponse> {
        return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve, {scope: 'email'})))
            .pipe(concatMap(statusResponse => {
                if (!statusResponse) {
                    return EMPTY;
                }
                return of(statusResponse);
            }));
    }

    fetchFBUserData(accessToken, fields) {
        return new Promise((resolve, reject) => {
            FB.api(
                    '/me',
                    'get',
                    {
                        accessToken,
                        fields
                    },
                    (fbUserDataResponse) => {
                          if(!fbUserDataResponse['error']) {
                            resolve(fbUserDataResponse);
                          } else {
                              reject(fbUserDataResponse['error']);
                          }
                    }
                );
        });
    }

    /**
     * revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
     */
    logout() {
        FB.api('/me/permissions', 'delete', null, () => FB.logout());
        //this.stopAuthenticateTimer();
        //this.accountSubject.next(null);
        this.router.navigate(['/login']);
    }

}
