import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProgrammePage } from '../pages/programme/programme';
import { EventsPage } from '../pages/events/events';
import { LoginPage } from '../pages/login/login';
import { EventDetailsPage } from '../pages/eventDetails/event-details';
import { ProgrammeDetailsPage } from '../pages/programmeDetails/programme-details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '57bb799f'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProgrammePage,
    EventsPage,
    LoginPage,
    EventDetailsPage,
    ProgrammeDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    HttpModule,
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProgrammePage,
    EventsPage,
    LoginPage,
    EventDetailsPage,
    ProgrammeDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
