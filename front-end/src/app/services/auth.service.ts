import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase: SupabaseClient;
    private _currentUser = new BehaviorSubject<User | null>(null);

    private _session: Session | null = null;
    private initSessionPromise: Promise<void> | null = null;

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        const isBrowser = isPlatformBrowser(this.platformId);

        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
            auth: {
                persistSession: isBrowser, // Only persist session in browser
                autoRefreshToken: isBrowser,
                detectSessionInUrl: isBrowser
            }
        });

        if (isBrowser) {
            // Initialize using onAuthStateChange only to avoid double-lock contention
            // Create a promise that resolves when the first auth state change fires (initial session load)
            let resolveInit: () => void;
            this.initSessionPromise = new Promise((resolve) => {
                resolveInit = resolve;
            });

            // Listen for auth changes. This fires immediately with the current session state on init.
            this.supabase.auth.onAuthStateChange((_event, session) => {
                this._session = session;
                this._currentUser.next(session?.user ?? null);
                if (resolveInit) {
                    resolveInit();
                    resolveInit = null!; // Ensure it only resolves once (though promise settles once anyway)
                }
            });
        }
    }

    async ensureSessionLoaded(): Promise<void> {
        if (this.initSessionPromise) {
            await this.initSessionPromise;
        }
    }

    async getAccessToken(): Promise<string | undefined> {
        // If we have a cached valid session, return it
        if (this._session?.access_token) {
            return this._session.access_token;
        }

        // If initialization is in progress, wait for it
        if (this.initSessionPromise) {
            await this.initSessionPromise;
            if (this._session?.access_token) {
                return this._session.access_token;
            }
        }

        return undefined;
    }

    get currentUser$(): Observable<User | null> {
        return this._currentUser.asObservable();
    }

    get currentUserValue(): User | null {
        return this._currentUser.value;
    }

    async login(email: string) {
        const { error } = await this.supabase.auth.signInWithOtp({ email });
        if (error) throw error;
    }

    /**
     * For this project, we are using OTP (Magic Link) as it's the default.
     * But I'll also add Password login if you prefer to use that.
     */
    async loginWithPassword(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    async logout() {
        await this.supabase.auth.signOut();
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return !!this._currentUser.value;
    }

    async getSession() {
        return this.supabase.auth.getSession();
    }
}
