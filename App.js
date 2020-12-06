import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Button, Image } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import RNFS from 'react-native-fs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      mimeTypes: ['image/jpeg']
    };
    this.getPhotos = this.getPhotos.bind(this);
  }

  async getPhotos() {
    try {
      var res = await CameraRoll.getPhotos({
        first: 1
      });
      var imageUrl = res.edges[0].node.image.uri;

      // Try reformatting url
      // https://github.com/joltup/rn-fetch-blob/issues/227
      var appleId = imageUrl.substring(5, 41);
      var ext = 'JPG';
      var imageUrl2 = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

      console.log(imageUrl);
      console.log(imageUrl2);

      this.setState({
        imageUrl: imageUrl2
      });

      var imageBase64 = await RNFS.readFile(imageUrl2, 'base64');
      console.log(imageBase64);
      // Getting same error using imageUrl and ImageUrl2
      // Error: ENOENT: no such file or directory, open 'assets-library://asset/asset.JPG?id=CC95F08C-88C3-4012-9D6D-64A413D254B3&ext=JPG'
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
