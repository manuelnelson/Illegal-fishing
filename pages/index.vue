<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex class="map-container"
      xs12
      sm8
      md6>
      <div class="how-to-use">
        <p>This simple application helps to visualize <a href="https://www.ngdc.noaa.gov/eog/viirs/download_boat.html" target="_blank">this dataset</a>.  To use, simply input the dates you are interested in, and create a region by selecting two points on the map (by double clicking) to retrieve the fishing information available for that region.</p>
        <p v-if="showInputError" class="input-error">Please make sure you've selected dates and two points on the map to run the search</p>
        <v-form v-model="valid">
           <v-menu
            ref="startmenu"
              :close-on-content-click="false"
              v-model="startmenu"
              :nudge-right="40"
              :return-value.sync="startpicker"
              lazy
              transition="scale-transition"
              offset-y              
              min-width="290px"
              class="combo-box"
            >
            <v-combobox
                slot="activator"
                v-model="startpicker"
                multiple
                chips
                small-chips
                label="Select start and end date"
                prepend-icon="event"                
                readonly
              ></v-combobox>
              <v-date-picker v-model="startpicker" multiple no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="startmenu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.startmenu.save(startpicker)">OK</v-btn>
              </v-date-picker>
           </v-menu>
           <v-btn color="primary" @click="runSearch()">Run Search</v-btn>
        </v-form>
      </div>
      <p v-if="isLoading">Loading ...</p>
      <div class="interactive-map">
        <div class="interactive-map__container">
          <div id="map" class="interactive-map__map">
          </div>
        </div>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
import $Scriptjs from 'scriptjs';
import { setTimeout } from 'timers';
import { forEach } from 'async';

export default {
  data() {
    return {
      startpicker: [],
      startmenu: false,
      valid: true,
      markers: [],
      boats: [],
      showInputError: false,
      rect: null,
      isLoading: false
    }
  },
  components: {
  },
  mounted() {
    $Scriptjs(`https://maps.googleapis.com/maps/api/js?key=AIzaSyAzBfPzy4A1crGJfeChgjnqZ3JvamQtKhg`, () => {
      this.initMap()
    })
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 8.4871397, lng: -13.2356005},
        zoom: 5,
        disableDoubleClickZoom: true,
      }); 
      var that = this;
      this.map.addListener('dblclick', function(e) {
        if(that.markers.length > 1) {
          that.markers[0].setMap(null);
          that.markers.splice(0,1);
        }
        let marker = new google.maps.Marker({
          position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
          map: that.map,
          title: `latitude: ${e.latLng.lat()}, longitude: ${e.latLng.lng()}`
        });
        that.markers.push(marker);
        if(that.markers.length === 2) {
            if(that.rect)
              that.rect.setMap(null);
            let bounds = new google.maps.LatLngBounds(
              that.markers[0].position, 
              that.markers[1].position
            )
            that.rect = new google.maps.Rectangle({
              bounds: bounds,
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeWeight: 0,
              map: that.map
          });
        }
      })     
    },
    async runSearch() {
      this.showInputError = false; 
      if(this.markers.length > 1 && this.startpicker.length === 2) {
        this.clearBoats();
        let date1 = new Date(this.startpicker[0]);
        let date2 = new Date(this.startpicker[1]);
        if(date1 > date2){
          date1 = this.startpicker[1];
          date2 = this.startpicker[0];
        } else {
          date1 = this.startpicker[0];
          date2 = this.startpicker[1];
        }
        this.isLoading = true;
        let result = await this.$axios.get(`/api/map?startDate=${date1}&endDate=${date2}&lat1=${this.markers[0].position.lat()}&lng1=${this.markers[0].position.lng()}&lat2=${this.markers[1].position.lat()}&lng2=${this.markers[1].position.lng()}`)
        this.isLoading = false;
        if(result.data.results && result.data.results.length > 0) {
          //plot boats
          let boats = result.data.results;
          let that = this;
          boats.forEach(boat => {
            that.boats.push(new google.maps.Marker({
              position: {lat: boat.lat_dnb, lng: boat.lon_dnb},
              map: that.map,
              title: `Date: ${new Date(boat.date_mscan).toDateString()}`,
              icon: that.getIcon(boat)
            }))
          });
          var markerCluster = new MarkerClusterer(this.map, this.boats, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});        
        }
        return;
      }
      this.showInputError = true; 
    },
    getIcon() {
      switch(boat.type) {
        case 1:
          return 'http://maps.google.com/mapfiles/kml/shapes/sailing.png';
        case 2: 
          return 'http://maps.google.com/mapfiles/kml/shapes/target.png';
        case 3:
          return 'http://maps.google.com/mapfiles/kml/shapes/rainy.png';
        case 8:
          return 'http://maps.google.com/mapfiles/kml/shapes/triangle.png';
      }
    },
    clearBoats() {
      this.boats.forEach(boat => {
        boat.setMap(null);
      })
    }

  }
}
</script>
<style lang="scss">
.map-container {
  width: 100%;
}
.combo-box {
  width: 50%;
  min-width: 290px;
}
.theme--dark.v-select .v-chip--disabled {
  color: #1867c0;
}
.input-error {
  color: #ff0000;
}
.v-date-picker-table .v-btn.accent--text {
  color:#1867c0 !important;
}
.v-date-picker-header__value .accent--text {
  color: #fff !important;
}
.interactive-map {
  height: calc(100vh - 140px);
  //width: calc(100vw - 140px);
  width: 100%;
  &__container {
    display: flex;
    height: 100%;
    position: relative;
  }
  &__map {
    width: 100%;
    height: 100%;
  }
}
</style>
