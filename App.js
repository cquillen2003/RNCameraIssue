import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Button, Image } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

/*
RNFetchBlob no longer maintained per GitHub
https://github.com/joltup/rn-fetch-blob/commit/dcbde6f7e12b666b9fe1c8c4a8e2cb04e0048326

Files from Camera Roll using RNFetchBlob
https://github.com/joltup/rn-fetch-blob/wiki/File-System-Access-API#differences-between-file-source

Directory changes every time you access the file system on iOS?
https://github.com/joltup/rn-fetch-blob/wiki/File-System-Access-API#readfilepath-encodingpromise
*/

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
				first: 1,
				mimeTypes: ['image/jpeg']
			});

			console.log(res);

			var imageUrlFormat1 = res.edges[0].node.image.uri;

			var imageUrlFormat2;
			var appleId = imageUrlFormat1.substring(5, 41); // https://github.com/joltup/rn-fetch-blob/issues/227
			var ext = 'JPG';
			imageUrlFormat2 = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

			console.log(imageUrlFormat1);
			console.log(imageUrlFormat2);

			this.setState({
				imageUrl: imageUrlFormat1
			});

			var imageBase64;

			// Try react-native-fs
			imageBase64 = await RNFS.readFile(imageUrlFormat1, 'base64'); // Getting error: Error: ENOENT: no such file or directory
			console.log('react-native-fs result', imageBase64);

			// Try rn-fetch-blob
			// imageBase64 = await RNFetchBlob.fs.readFile(imageUrlFormat2, 'base64');
			// console.log('rn-fetch-blob result', imageBase64); // Getting an empty string
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
