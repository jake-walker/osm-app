import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';

import { OsmProgrammePage } from '../pages/osm/programme/programme';
import { OsmEventsPage } from '../pages/osm/events/events';
import { OsmLoginPage } from '../pages/osm/login/login';
import { OsmEventDetailsPage } from '../pages/osm/eventDetails/event-details';
import { OsmProgrammeDetailsPage } from '../pages/osm/programmeDetails/programme-details';

import { OsmProvider } from '../providers/osm/osm';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    OsmProgrammePage,
    OsmEventsPage,
    OsmLoginPage,
    OsmEventDetailsPage,
    OsmProgrammeDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    OsmProgrammePage,
    OsmEventsPage,
    OsmLoginPage,
    OsmEventDetailsPage,
    OsmProgrammeDetailsPage
  ],
  providers: [
    HTTP,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OsmProvider
  ]
})
export class AppModule {}
