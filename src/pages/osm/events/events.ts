import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { OsmEventDetailsPage } from '../eventDetails/event-details';

import { OsmProvider } from '../../../providers/osm/osm';
import { SettingsPage } from '../../settings/settings';

@Component({
  selector: 'page-osm-events',
  templateUrl: 'events.html'
})
export class OsmEventsPage {
  events: any = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public osm: OsmProvider, public alertCtrl: AlertController) {
    osm.validCredentials().then((valid) => {
      if (!valid) {
        throw new Error("hide");
      }
      return osm.getData();
    }, osm.chainError).then((data) => {
      this.events = data["events"];
    }, osm.chainError).catch((error) => {
      if (error.message != "hide") {
        this.alertCtrl.create({
          title: "Problem syncing!",
          subTitle: error,
          buttons: ["OK"]
        }).present();
      } else {
        this.alertCtrl.create({
          title: "OSM not enabled!",
          subTitle: "To use the events part of the app you need to setup Online Scout Manager in the settings.",
          buttons: ["OK"]
        }).present();
        navCtrl.setRoot(SettingsPage);
      }
    });
  }

  eventDetails(event) {
    this.navCtrl.push(OsmEventDetailsPage, {
      event: event
    });
  }
}
