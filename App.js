import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Button, Image } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    };
    this.getPhotos = this.getPhotos.bind(this);
  }

  async getPhotos() {
    var res = await CameraRoll.getPhotos({
      first: 1
    });
    console.log('CameraRoll.getPhotos() response', res);
    this.setState({
      imageUrl: res.edges[0].node.image.uri
    });
  }

  render() {
    return (
      <>
        <StatusBar />
        <SafeAreaView>
          <Button
            onPress={this.getPhotos}
            title="Pick an image"
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
