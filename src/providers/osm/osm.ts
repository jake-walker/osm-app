import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';
import { Network } from '@ionic-native/network';

@Injectable()
export class OsmProvider {
  sid: any = "";
  sed: any = "";
  cache: any = {};
  connected: boolean = false;

  constructor(public http: HTTP, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public network: Network) {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log("network connected!");
      setTimeout(() => {
        this.connected = true;
      }, 3000);
    });

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log("network disconnected");
      this.connected = false;
    });
  }

  setCredentials(email, password) {
    return this.storage.set("osm_credentials", {
      email: email,
      password: password
    });
  }

  delCredentials() {
    return this.storage.remove("osm_credentials");
  }

  getCredentials() {
    return this.storage.get("osm_credentials").then((credentials) => {
      return credentials;
    }, this.chainError);
  }

  logout() {
    this.sid = "";
    this.sed = "";
    this.http.clearCookies();
    return this.delCredentials();
  }

  validCredentials() {
    return this.storage.get("osm_credentials").then((credentials) => {
      if (!credentials) {
        return false;
      }

      if (!credentials["email"] || !credentials["password"]) {
        return false;
      }

      return true;
    }, this.chainError);
  }

  chainError(err) {
    return Promise.reject(err);
  }

  login() {
    if (this.sid != "" && this.sed != "") {
      return this.validCredentials();
    }

    return this.validCredentials().then((valid) => {
      if (!valid) {
        throw new Error("Problem logging in: Invalid credentials!");
      }

      return this.getCredentials();
    }, this.chainError).then((creds) => {
      return this.http.post("https://www.onlinescoutmanager.co.uk/parents/ajax.php?action=login", Object.assign({}, this.requestHeaders(), {
        email: creds.email,
        password: creds.password
      }), {});
    }, this.chainError).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem logging in: HTTP ${data.status}.`);
      }

      let res = {
        ok: false
      };
      try {
        res = JSON.parse(data.data);
      } catch (e) {
        throw new Error("Problem logging in: Unexpected response from OSM.");
      }

      if (!res.ok) {
        throw new Error("Problem logging in: Incorrect credentials!");
      }

      return this.getSidSed();
    }, this.chainError);
  }

  getSidSed() {
    if (this.sid != "" && this.sed != "") {
      return this.validCredentials();
    }

    return this.http.get('https://www.onlinescoutmanager.co.uk/parents/notice.php', {}, this.requestHeaders()).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem fetching SID and SED: HTTP ${data.status}.`);
      }

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

      this.sid = this.sid;
      this.sed = this.sed;

      return true;
    }, this.chainError);
  }

  sync(force = false, loader = null) {
    return this.storage.get("osm_cache").then((val) => {
      if (val && val["lastUpdate"] && force != true) {
        var cacheAge = Math.abs((new Date()).getTime() - (new Date(val["lastUpdate"])).getTime()) / 36e5;
        if (cacheAge <= 24) {
          this.cache = val;
          return new Promise ((resolve) => resolve(this.cache));
        }
      }

      if (loader) {
        loader.present();
      }
      return this.updateCache(loader);
    }, this.chainError);
  }

  getData() {
    let loading = this.loadingCtrl.create({
      content: "Syncing..."
    });
    return this.sync(false, loading).then((data) => {
      loading.dismiss();
      return data;
    }, this.chainError).catch((err) => {
      loading.dismiss();
    });
  }

  updateLoader(loader, message) {
    if (loader) {
      loader.setContent(message);
    }
  }

  updateCache(loader = null) {
    let programme = [];
    let events = [];
    let noticeboard = "";
    let lastUpdate = new Date();

    if (!this.connected) {
      return new Promise((resolve, reject) => {
        throw new Error("Problem updating cache: Cannot connect to the internet");
      });
    }

    this.updateLoader(loader, "Fetching programme...");
    return this.getProgramme().then((p) => {
      programme = p;
      return this.getEvents();
    }, this.chainError).then((e) => {
      var promises = [];

      for (var i = 0; i < e.length; i++) {
        var promise = this.getEventDetails(e[i]);
        promises.push(promise);
      }

      this.updateLoader(loader, "Fetching event details...");
      return Promise.all(promises);
    }, this.chainError).then((e) => {
      events = e;
      this.updateLoader(loader, "Fetching noticeboard...");
      return this.getNoticeboard();
    }, this.chainError).then((n) => {
      noticeboard = n;

      let output = {
        programme: programme,
        events: events,
        noticeboard: noticeboard,
        lastUpdate: lastUpdate,
      };

      this.updateLoader(loader, "Updating cache...");
      this.storage.set("osm_cache", output);
      this.cache = output;
      return output;
    }, this.chainError);
  }

  getProgramme() {
    return this.login().then(() => {
      return this.http.get("https://www.onlinescoutmanager.co.uk/parents/programme.php", {
        sid: this.sid,
        sed: this.sed,
      }, this.requestHeaders());
    }, this.chainError).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem fetching programme: HTTP ${data.status}.`);
      }

      let $ = cheerio.load(data.data);
      cheerioTableparser($);

      let events = this.parseTableToObject($("#mainInner").find("table").parsetable());

      events.forEach((event) => {
        let temp = cheerio.load(event.details);
        event.details = temp("div").html();
      });

      return events;
    }, this.chainError);
  }

  getEvents() {
    return this.login().then(() => {
      return this.http.get("https://www.onlinescoutmanager.co.uk/parents/events.php", {
        sid: this.sid,
        sed: this.sed
      }, this.requestHeaders());
    }, this.chainError).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem fetching events: HTTP ${data.status}.`);
      }

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

      return events;
    }, this.chainError);
  }

  getEventDetails(event) {
    let eid = event.id;
    return this.login().then(() => {
      return this.http.get("https://www.onlinescoutmanager.co.uk/parents/events.php", {
        sid: this.sid,
        sed: this.sed,
        a: "v",
        e: eid
      }, this.requestHeaders());
    }, this.chainError).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem fetching event details: HTTP ${data.status}.`);
      }

      let $ = cheerio.load(data.data);

      let details = "";

      $("#mainInner").find("h3:contains('Details')").nextAll().each((i, element) => {
        details += $.html(element);
      });

      let output = {
        when: $("#mainInner").find(".dl-horizontal").find("dt:contains('When')").next().text().trim(),
        where: $("#mainInner").find(".dl-horizontal").find("dt:contains('Where')").next().text().trim(),
        signUpBefore: $("#mainInner").find(".dl-horizontal").find("dt:contains('Sign up before')").next().text().trim(),
        details: details.split("\n").join("")
      };

      return Object.assign({}, output, event);;
    }, this.chainError);
  }

  getNoticeboard() {
    return this.login().then(() => {
      return this.http.get("https://www.onlinescoutmanager.co.uk/parents/notice.php", {
        sid: this.sid,
        sed: this.sed,
      }, this.requestHeaders());
    }, this.chainError).then((data) => {
      if (data.status != 200) {
        throw new Error(`Problem fetching noticeboard: HTTP ${data.status}.`);
      }

      let $ = cheerio.load(data.data);
      let output = $("#noticeboard").html().trim();

      return output;
    }, this.chainError);
  }

  // CONFIG

  requestHeaders() {
    return {
      "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36" // Nexus 6P User Agent
    }
  }

  // HELPERS

  parseTableToObject(table) {
    let keys = [];
    let output = [];

    table.forEach(function(row) {
      keys.push(row[0].toLowerCase());
    });

    for (var r = 0; r < table.length; r++) {
      for (var c = 1; c < table[r].length; c++) {
        if (r == 0) {
          output[c-1] = {};
        }
        output[c-1][keys[r]] = table[r][c];
      }
    }

    return output;
  }
}
