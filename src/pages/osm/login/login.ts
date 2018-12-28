import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { LoadingController } from 'ionic-angular';

import { OsmProvider } from '../../../providers/osm/osm';
import { SettingsPage } from '../../settings/settings';

@Component({
  selector: 'page-osm-login',
  templateUrl: 'login.html',
  providers: [
    HTTP
  ]
})
export class OsmLoginPage {

  public loginForm = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public navCtrl: NavController, public fb: FormBuilder, public loaderCtrl: LoadingController, public http: HTTP, public storage: Storage, public osm: OsmProvider, public alertCtrl: AlertController) {

  }

  doLogin(event) {
    // Save credentials
    this.osm.setCredentials(this.loginForm.controls.email.value, this.loginForm.controls.password.value);

    let loading = this.loaderCtrl.create({
      content: "Checking Credentials..."
    });

    loading.present();

    this.osm.login().then(() => {
      loading.dismiss();
      this.alertCtrl.create({
        title: "Login successful!",
        subTitle: "Your OSM credentials are correct and have been saved to the local device.",
        buttons: ["Great!"]
      }).present();
      this.navCtrl.setRoot(SettingsPage);
    }).catch((error) => {
      loading.dismiss();
      this.alertCtrl.create({
        title: "Login unsuccessful",
        subTitle: error,
        buttons: ["OK"]
      }).present();
      this.osm.delCredentials();
    });
  }

}
