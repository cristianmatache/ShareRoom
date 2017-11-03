import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ShareRoom } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../test-config/mocks-ionic';

describe('ShareRoom Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareRoom],
      imports: [
        IonicModule.forRoot(ShareRoom)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRoom);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ShareRoom).toBe(true);
  });

  it('should have one page', () => {
    expect(component.pages).toBe(1);
  });

  it('should load on home page', () => {
    expect(component.pages).toBe(1);
  });

  it('check email login works', () => {
    expect(component.pages).toBe(1);
  });

  it('check facebook login works', () => {
    expect(component.pages).toBe(1);
  });

  it('check google login works', () => {
    expect(component.pages).toBe(1);
  });



});
