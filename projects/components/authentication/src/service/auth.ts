import { User } from "../model/user";

/**
 * Information that should be acquired after authenticated in provider.
 */
export interface ProviderAuthResult {
    provider: string
    token: string //generally an opaque token
    idInProvider: string
    name: string
    email?: string
}

export interface InternalAuthResult {
    //provider: string
    accessToken: string //a jwt token
    user: User
}

/**
 * Any external server that provides identity check
 */
export interface AuthProvider {

    /**
     * Performs authentication at the provider
     */
    login(): Promise<ProviderAuthResult>
}