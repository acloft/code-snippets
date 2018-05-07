import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  Dimensions
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StackNavigator } from "react-navigation";

import defaults from "./geoServiceDefaults";

const { width, height } = Dimensions.get("window");
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  map = null;

  state = {
    region: {
      //...
    },
    ready: true
  };

  setRegion(region) {
    this.map.animateToRegion(region);
  }

  componentDidMount() {
    if (this.props.staticMap) {
      let latLongs = this.props.points.map(point => {
        return {
          latitude: point.coords.latitude,
          longitude: point.coords.longitude
        };
      });
      setTimeout(() => {
        this.map.fitToCoordinates(latLongs, {
          edgePadding: { top: 60, right: 30, bottom: 30, left: 30 },
          animated: false
        });
      }, 0);
    } else {
      this.getCurrentPosition();
    }
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };

        this.setRegion(region);
      },
      error => alert(error.message),
      defaults
    );
  }

  onMapReady = e => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  render() {
    return (
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          ref={map => {
            this.map = map;
          }}
          intialRegion={this.state.region}
          onMapReady={this.onMapReady}
          style={styles.map}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {" "}
          {this.props.points
            ? this.props.points.map(point => {
                return (
                  <Marker
                    key={point.timestamp}
                    coordinate={{
                      latitude: point.coords.latitude,
                      longitude: point.coords.longitude
                    }}
                  />
                );
              })
            : null}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    width: SCREEN_WIDTH,
    height: 500
  }
});
