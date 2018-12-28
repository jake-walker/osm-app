import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { OsmProvider } from '../../../providers/osm/osm';

import { OsmProgrammeDetailsPage } from '../programmeDetails/programme-details';
import { SettingsPage } from '../../settings/settings';

@Component({
  selector: 'page-osm-programme',
  templateUrl: 'programme.html'
})
export class OsmProgrammePage {
  programme: any = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public osm: OsmProvider, public alertCtrl: AlertController) {
    osm.validCredentials().then((valid) => {
      if (!valid) {
        throw new Error("hide");
      }
      return osm.getData();
    }, osm.chainError).then((data) => {
      this.programme = data["programme"];
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
          subTitle: "To use the programme part of the app you need to setup Online Scout Manager in the settings.",
          buttons: ["OK"]
        }).present();
        navCtrl.setRoot(SettingsPage);
      }
    });
  }

  programmeDetails(event) {
    this.navCtrl.push(OsmProgrammeDetailsPage, {
      event: event
    });
  }
}
