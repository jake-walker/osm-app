import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { OsmProvider } from '../../providers/osm/osm';
import { OsmProgrammeDetailsPage } from '../osm/programmeDetails/programme-details';
import { OsmEventDetailsPage } from '../osm/eventDetails/event-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any = "";
  osmLoggedIn: boolean = false;

  constructor(public navCtrl: NavController, public osm: OsmProvider, public alertCtrl: AlertController) {
    osm.validCredentials().then((valid) => {
      if (!valid) {
        throw new Error("hide");
      }
      this.osmLoggedIn = true;
      return osm.getData();
    }, osm.chainError).then((data) => {
      this.data = data;
    }, osm.chainError).catch((error) => {
      if (error.message != "hide") {
        this.alertCtrl.create({
          title: "Problem syncing!",
          subTitle: error,
          buttons: ["OK"]
        }).present();
      }
    });
  }

  programmeDetails(event) {
    this.navCtrl.push(OsmProgrammeDetailsPage, {
      event: event
    });
  }

  eventDetails(event) {
    this.navCtrl.push(OsmEventDetailsPage, {
      event: event
    });
  }
}
