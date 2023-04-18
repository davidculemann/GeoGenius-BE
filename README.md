# GeoGenius

GeoGenius is a geography themed quiz website inspired by [higher-lower](http://www.higherlowergame.com/). The project is configured to use
Firebase for user auth, and this express app uses the Firebase admin-sdk for user creation and handling requests from the
[front-end](https://github.com/davidculemann/GeoGenius-FE).

## Installation

1. Clone the repository:

```
git clone git@github.com:davidculemann/GeoGenius-BE.git
```

2. Install the dependencies using Yarn:

```
cd GeoGenius-BE
yarn
```

## Usage

1. Start the express server in development mode:

```
yarn start:dev
```

2. Open your web browser and navigate to `http://localhost:4000`.

## Deployment

To deploy the application, you need to set up a Firebase project and configure it for hosting. Once you have done that, you can use the
following commands to deploy the application:

1. Build the production version of the application:

```
yarn deploy
```

## Credits

Country data from [World Bank](https://data.worldbank.org/).

GeoGenius was created by [David Culemann](https://github.com/davidculemann).
