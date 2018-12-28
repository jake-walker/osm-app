import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { OsmProvider } from '../../providers/osm/osm';
import { OsmLoginPage } from '../osm/login/login';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  loggedInAs: string = "";
  cache: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public osm: OsmProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    osm.validCredentials().then((valid) => {
      if (!valid) {
        throw new Error("skip");
      }
      return osm.getCredentials();
    }, osm.chainError).then((creds) => {
      this.loggedInAs = creds["email"];
      return osm.getData();
    }, osm.chainError).then((data) => {
      this.cache = data;
    }, osm.chainError).catch((error) => {
      if (error.message != "skip") {
        this.alertCtrl.create({
          title: "Problem syncing!",
          subTitle: error,
          buttons: ["OK"]
        }).present();
      }
    });
  }

  sync() {
    const loader = this.loadingCtrl.create({
      content: "Syncing..."
    });
    loader.present();
    this.osm.sync(true).then((data) => {
      this.cache = data;
      loader.dismiss();
    }).catch((error) => {
      alert(error);
    });
  }

  login() {
    this.navCtrl.setRoot(OsmLoginPage);
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: "Logout?",
      message: "Do you really want to logout?",
      buttons: [
        {
          text: "No"
        },
        {
          text: "Yes",
          handler: () => {
            this.osm.logout();
            this.loggedInAs = "";
          }
        }
      ]
    });
    confirm.present();
  }
}
