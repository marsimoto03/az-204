import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private msal: MsalService) {}

  req: SilentRequest = {
    scopes: ['user.read'],
    account: this.msal.instance.getAllAccounts()[0],
  };

  tryLoginSilent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.tryloginsilent),
      mergeMap(() =>
        this.msal.acquireTokenSilent(this.req).pipe(
          map((resp) => AuthActions.loginsuccess({ authResponse: resp })),
          catchError((err) => of(AuthActions.autherror({ err })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.msal.logout().pipe(
          map((resp) => AuthActions.logoutsuccess()),
          catchError((err) => of(AuthActions.autherror({ err })))
        )
      )
    )
  );
}
