import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Button, Image } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import RNFS from 'react-native-fs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    };
    this.getPhotos = this.getPhotos.bind(this);
  }

  async getPhotos() {
    try {
      var res = await CameraRoll.getPhotos({
        first: 1
      });
      var imageUrl = res.edges[0].node.image.uri;

      this.setState({
        imageUrl: imageUrl
      });

      var imageBase64 = await RNFS.readFile(imageUrl, 'base64');
      console.log(imageBase64);
    }
    catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView>
          <Button
            onPress={this.getPhotos}
            title="Get latest photo"
          />
          { this.state.imageUrl &&
            <Image
              style={{ width: 300, height: 100 }}
              source={{ uri: this.state.imageUrl }}
            />
          }
        </SafeAreaView>
      </>
    );
  }
};

export default App;
