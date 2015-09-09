# Map-Project

## Description
Travel the globe from your desk.

## Screenshots
![Alt text](/public/images/globe.png?raw=true "The Globe")
![Alt text](/public/images/russia.png?raw=true "Somewhere in Russia")
![Alt text](/public/images/greatwall.png?raw=true "Great Wall of China")

## Background
Bored? Too lazy to move? Love travelling? This is the solution.

## Features
- Drag to spin the globe.
- Click to see a streetview.

## Development
Down to Earth is built in JavaScript. It's a one page app that we wrapped in Node.js so we could deploy it to Heroku. 

The globe is animated using WebGL Earth (http://www.webglearth.org/api). We pass the coordinates from a click on the globe to Google Maps to render a map and the closest streeetview. 

## Usage
Check out down-to-earth.herokuapp.com

