import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { EventDetailsPage } from '../eventDetails/event-details';

import cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  providers: [
    HTTP
  ]
})
export class EventsPage {
  phpsession: any;
  sid: any;
  sed: any;
  events: any;

  constructor(public navCtrl: NavController, public http: HTTP, public storage: Storage, public loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({
      content: "Downloading Events..."
    });

    loader.present();
    this.login().then(() => {
      this.getProgramme().then((events) => {
        this.events = events;
        loader.dismiss();
      });
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      this.storage.get("email").then((email) => {
        this.storage.get("password").then((password) => {
          this.http.post('https://www.onlinescoutmanager.co.uk/parents/ajax.php?action=login', {
            email: email,
            password: password
          }, {}).then((data) => {
            if (data.status == 200) {
              let res = JSON.parse(data.data);
              if (res.ok) {
                if (data.headers["Set-Cookie"].startsWith("PHPSESSID=")) {
                  this.phpsession = data.headers["Set-Cookie"].split("PHPSESSID=")[1];
                  this.phpsession = this.phpsession.substr(0, this.phpsession.indexOf(";"));
                  this.getSidSed().then(() => {
                    resolve();
                  });
                }
              } else if (res.password) {
                alert("Incorrect Password");
                this.navCtrl.setRoot(LoginPage);
              } else if (res.account) {
                alert("Incorrect Email");
                this.navCtrl.setRoot(LoginPage);
              } else {
                alert("Unknown Outcome");
                this.navCtrl.setRoot(LoginPage);
              }
            }
          });
        });
      });
    });
  }

  getSidSed() {
    return new Promise((resolve, reject) => {
      this.http.post('https://www.onlinescoutmanager.co.uk/parents/notice.php', {}, {
        Cookie: "PHPSESSID=" + this.phpsession
      }).then((data) => {
        if (data.status == 200) {
          let $ = cheerio.load(data.data);

          let query = $(".nav").find("li.active").find("a").attr("href");
          query = query.substr(query.indexOf("?") + 1);

          query.split("&").forEach((part) => {
            if (part.startsWith("sid=")) {
              this.sid = part.split("sid=")[1];
            } else if (part.startsWith("sed=")) {
              this.sed = part.split("sed=")[1];
            }
          });

          this.sid = parseInt(this.sid);
          this.sed = parseInt(this.sed);

          resolve();
        }
      });
    });
  }

  getProgramme() {
    return new Promise((resolve, reject) => {
      this.http.get("https://www.onlinescoutmanager.co.uk/parents/events.php", {
        sid: this.sid,
        sed: this.sed
      }, {
        Cookie: "PHPSESSID=" + this.phpsession
      }).then((data) => {
        if (data.status == 200) {
          let $ = cheerio.load(data.data);
          cheerioTableparser($);

          let events = this.parseTableToObject($("#mainInner").find("table").parsetable());

          events.forEach((event) => {
            let temp = cheerio.load(event.attending);
            event.attending = temp("span").html();
            if (event.attending == "Yes") {
              event["attendingtext"] = "Attending";
              event.attending = true;
            } else if (event.attending == "No") {
              event["attendingtext"] = "Not Attending";
              event.attending = false;
            } else {
              event["attendingtext"] = event.attending;
              event.attending = false;
            }
            let temp1 = cheerio.load(event.details);
            let id = temp1("a").attr("href");
            id = id.substr(id.indexOf("?") + 1);
            id.split("&").forEach((part) => {
              if (part.startsWith("e=")) {
                event["id"] = part.split("e=")[1];
              }
            });
            delete event["details"];
          });

          resolve(events);
        }
      });
    });
  }

  parseTableToObject(table) {
    let keys = [];
    let output = [];

    table.forEach(function(row) {
      keys.push(row[0].toLowerCase());
    });

    for (var r = 0; r < table.length; r++) {
      for (var c = 1; c < table[r].length; c++) {
        if (r == 0) {
          //console.log("new obj");
          output[c-1] = {};
        }
        //console.log((c-1) + " -> " + keys[r] + ": " + table[r][c]);
        output[c-1][keys[r]] = table[r][c];
      }
    }

    return output;
  }

  eventDetails(event) {
    this.navCtrl.push(EventDetailsPage, {
      event: event
    });
  }
}
