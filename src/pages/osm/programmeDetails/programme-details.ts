import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-osm-programme-detials',
  templateUrl: 'programme-details.html'
})
export class OsmProgrammeDetailsPage {
  event: any;

  constructor(public navCtrl: NavController, public params: NavParams) {
    this.event = this.params.get("event");
  }
}
