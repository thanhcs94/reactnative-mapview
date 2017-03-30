/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox'


const region = {
  latitude: 10.8231,
  longitude: 106.6297,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
var options = {
  title: 'Select Photo',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const img_marker = require('./resource/pink_marker.png')
export default class ReactMap extends Component {
  state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      current_position : '',
      markers :[]
    };

   componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({initialPosition});
        console.log("LOCATION " + JSON.stringify(initialPosition));
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      console.log("Location : " + lastPosition)
      // this.setState(
      //   {
      //      markers:[...this.state.markers, {latlng:lastPosition, imagePath :'null', title:"current location"}]
      //   });
      // Uncomment if you want to make a marker for your current location .

      console.log("Location State : " + JSON.stringify(this.state.markers))
    });
  }
  
  componentWillUnmount() {
   navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  _uploadPhotoOption(coordinate){
    /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info below in README)
   */
  ImagePicker.showImagePicker(options, (response) => {
  //console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      let source = { uri: response.uri };
      console.log("=======")
      console.log(JSON.stringify(response.uri));
      console.log("=======")
      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      this.setState({
          markers:[...this.state.markers, {latlng: coordinate, imagePath:source, title:"medium.com/@thanhcs94\n"}]
      });
    }
  });
}

 renderMarkers() {
    let markers = this.state.markers
    let markerArrays = [];
    for(let i = 0; i< markers.length ; i++){
      let item = markers[i];
      markerArrays.push(
        <MapView.Marker  key={i}  coordinate={item.latlng}  title={'F** mapview'} >

                <Image
                  style={{width:30, height:30}}
                  source={img_marker}
                  onLoad={() => this.forceUpdate()}>
                  <Text style={{width:0, height:0}}>{Math.random()}</Text>
                </Image>

                  <MapView.Callout  style={{ alignItems: 'center', justifyContent: 'center', width:170}}>
                    <Lightbox
                      renderContent={() => {
                        return (<Image source={item.imagePath}
                              style={{flex: 1}}/>);}}>

                      <Image source={item.imagePath}
                        style={{width:150, height: 150,borderRadius:10}}/>

                    </Lightbox>
                    <Text style={{fontSize: 12, fontWeight:'500', marginTop:10}}>{item.title}</Text>
                  </MapView.Callout>
                </MapView.Marker>
              )
   }
    return markerArrays;
  }

  render() {
    return (
        <MapView
          ref='map'
          initialRegion={region}
          style={{flex:1}}
          onRegionChange={this.onRegionChange.bind(this)}
          onLongPress={(e) => {
                const { coordinate } = e.nativeEvent;
                console.log('coordinate', coordinate);
                this._uploadPhotoOption(coordinate);
              }}
          >  
          {this.renderMarkers()} 
      </MapView>
    );
  }
}
AppRegistry.registerComponent('ReactMap', () => ReactMap);