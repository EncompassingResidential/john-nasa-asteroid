# John's NASA NEO Asteroid Search (JNNAS)

This App gets data from NASA's  “near earth objects” (NEO’s) JPL sever to search via the NASA API.

[You can find my CV Resume here at Linked In www](https://www.linkedin.com/in/johntritz/)

[click here for my personal Life Coach website](https://www.soberjourneycopilot.com/)

# manual acquistion of data

https://api.nasa.gov/

Generate API Key

Here is getting NEOs objects via date range:
https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-03-10&end_date=2022-03-10&api_key={API_KEY}

The date range data has asteroid ID which can be used to get more data about that NEO.  Here is API call for Asteroid ID:
https://api.nasa.gov/neo/rest/v1/neo/3313974?api_key=hk9dlTx899cmJzkwCDyLjxLbI1Apz2qh5IjGT3Ja

helped with Javascript FETCH commands
Using www https://www.javascripttutorial.net/javascript-fetch-api/

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
and Bootstrap styling library / framework.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
