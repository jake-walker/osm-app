import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    HTTP
  ]
})
export class LoginPage {

  public loginForm = this.fb.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(public navCtrl: NavController, public fb: FormBuilder, public loaderCtrl: LoadingController, public http: HTTP, public storage: Storage) {

  }

  doLogin(event) {
    let loading = this.loaderCtrl.create({
      content: "Checking Credentials..."
    });

    loading.present();

    this.http.post('https://www.onlinescoutmanager.co.uk/parents/ajax.php?action=login', {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }, {}).then((data) => {
      if (data.status == 200) {
        let res = JSON.parse(data.data);
        if (res.ok) {
          this.storage.set("email", this.loginForm.controls.email.value);
          this.storage.set("password", this.loginForm.controls.password.value);
          this.navCtrl.setRoot(HomePage);
          loading.dismiss();
        } else if (res.password) {
          loading.dismiss();
          alert("Incorrect Password");
        } else if (res.account) {
          loading.dismiss();
          alert("Incorrect Email");
        } else {
          loading.dismiss();
          alert("Unknown Outcome");
        }
      } else {
        loading.dismiss();
        alert("Problem connecting to Online Scout Manager. Check your connection or try later.");
      }
    });
  }

}
