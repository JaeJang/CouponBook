# React Native Multi Loader
React Native Component for Multiple animated loaders and loading texts 


![Character Grow Text](Images/Character%20Grow.gif)
![Dots Loader Blink Grow Text](Images/Dots%20Loader.gif)

![Default Loader Default Text](Images/Default%20Loader.gif)
![Bar Loader Blink Text](Images/Bar%20Loader.gif) 

# NPM Repository
https://www.npmjs.com/package/react-native-multi-loader

# Install
`npm install react-native-multi-loader --save`

# Options
| Property | Type | Default | Available options| Description |
| :---------- |:----------| :-----|:-------|:-------|
| colorLoader     | String | 'white' | Any Color | Color of loading bars,spinner,dots |
| colorText      | String      |   'white'|Any Color | Color of the loading text |
| modalAimation | String      |    'none'| ['none', 'fade', 'slide'] | Animation Type for overlay |
| sizeLoader      | String      |   'Large'|['small', 'large' ] | Size of the loading spinner,bar,dots |
| sizeText | Number | 25 | Valid text size | Size of the loading text |
| textLoader| String | 'LOADING' | Any valid text | Loading Text to be displayed |
| visible | Boolean | false | [true, false] | To show/hide the overlay loader |
| loaderType | String | 'default' | [ '', 'default', 'bars', 'dots' ] | Type of the spinner |
| textType | String | 'default' | [ '', 'default', 'blink', 'blinkGrow', 'characterGrow'] | Type of the loading text |
| backgroundColor | String | '#00000088' (Transparent)| Any valid color | Background color of the overlay |

# Usage
```
import Loader from 'react-native-multi-loader';

<Loader visible={true} loaderType="bars" textType="blinkGrow"/>
```

# Recommend Usage

React Native Modal has some issues with Alert.
We recommend to use alert after some time of closing the loader :-

```
this.setState({ loader: false });

setTimeout(() => {
  Alert.alert('Loader Closed');
}, 100);
```

# License
[MIT](LICENSE) © Dharmendra Vaishnav
