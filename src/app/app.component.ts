import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { OsmProgrammePage } from '../pages/osm/programme/programme';
import { OsmEventsPage } from '../pages/osm/events/events';
import { SettingsPage } from '../pages/settings/settings';
import { HeaderColor } from '@ionic-native/header-color';
import { OsmProvider } from '../providers/osm/osm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, headerColor: HeaderColor, public osm: OsmProvider) {
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Programme', component: OsmProgrammePage },
      { title: 'Events', component: OsmEventsPage },
      { title: 'Settings', component: SettingsPage }
    ];

    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#9c27b0');

      headerColor.tint('#9c27b0');

      setTimeout(() => {
        splashScreen.hide();
      }, 100);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
