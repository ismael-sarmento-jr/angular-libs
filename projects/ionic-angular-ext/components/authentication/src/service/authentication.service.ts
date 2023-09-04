import { BehaviorSubject, Observable} from 'rxjs';
import { User } from '../model/user';
import { InternalAuthResult, ProviderAuthResult } from './auth';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    currentUserSubject: BehaviorSubject<User>;
    currentUser$: Observable<User>;

    /**
     * Checks the environment and if the provider was specified or stored.
     * It proceeds with login in case provider is found amd redirect to /login otherwise.
     */
    initLogin(provider?: string): void {};

    /**
     * Start the login flow according to the environment
     */
    doLoginInProvider(provider: string): void {};

    /** 
     * Authenticates with the api using a opaque access token,
    * on success the api returns an account object with a JWT auth token
    */
    apiAuthenticate(providerAuthResult: ProviderAuthResult): Observable<InternalAuthResult> {return null};

    /**
     * If not production, simply remove user from session and redirects to home, otherwise
     * dispatch to logout component
     */
    initLogout(): void {};

}