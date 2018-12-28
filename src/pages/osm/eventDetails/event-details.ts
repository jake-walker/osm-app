import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OsmProvider } from '../../../providers/osm/osm';

@Component({
  selector: 'page-osm-event-details',
  templateUrl: 'event-details.html'
})
export class OsmEventDetailsPage {
  event: any;

  constructor(public navCtrl: NavController, public params: NavParams, public osm: OsmProvider) {
    this.event = this.params.get("event");
  }
}
