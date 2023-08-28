import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationDialogComponent } from '../../view/authentication-dialog.component';

import { FbAuthService } from './fb-auth.service';

describe('FbAuthService', () => {
  let service: FbAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: AuthenticationDialogComponent
          }
        ])
      ]
    });
    service = TestBed.inject(FbAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
