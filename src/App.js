import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from "./component/Navigation/Navigation";
import FaceRecognition from "./component/FaceRecognition/FaceRecognition";
import Signin from "./component/Signin/Signin";
import Register from "./Register/Register";
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
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false
        }
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    };

    displayFaceBox = (box) => {
        this.setState({box: box});
    };

    onInputChange = (event) => {
        this.setState({input: event.target.value})
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL,
            this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
    };

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route})
    };

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state;
        return (
            <div className="App">
                <Particles className={"particles"}
                           params={particlesOptions}
                />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                { route === 'home' ?
                    <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm
                            onInputChange = {this.onInputChange}
                            onButtonSubmit = {this.onButtonSubmit}
                        />
                        <FaceRecognition box = {box} imageUrl = {imageUrl}/>
                    </div>
                    : (
                        route === 'signin' ?
                            <Signin onRouteChange = {this.onRouteChange}/>
                            :
                            <Register onRouteChange = {this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
