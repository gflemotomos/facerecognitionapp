import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from "./component/Navigation/Navigation";
import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Logo from "./component/Logo/Logo";
import ImageLinkForm from "./component/ImageLinkForm/ImageLinkForm";
import Rank from "./component/Rank/Rank";
import Particles from 'react-particles-js';

const app = new Clarifai.App({
    apiKey: '11fe1177dcd14389962ab27b488dfa55'
});

const particlesOptions = {
    particles: {
        number:{
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            imageUrl: ''
        }
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value})
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL,
            this.state.input)
            .then(
            function(response) {
                console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
            },
            function(err) {
                // there was an error
            }
        );
    };

    render() {
        return (
            <div className="App">
                <Particles className={"particles"}
                           params={particlesOptions}
                />
                <Navigation />
                <Logo />
                <Rank/>
                <ImageLinkForm
                    onInputChange = {this.onInputChange}
                    onButtonSubmit = {this.onButtonSubmit}
                />
                <FaceRecognition imageUrl = {this.state.imageUrl}/>
            </div>
        );
    }
}

export default App;
