# Online Scout Manager App

[Download](#download)

> I don't own Online Scout Manager!

[Online Scout Manager](https://www.onlinescoutmanager.co.uk/) is a website which allows people running scout troops to have less admin by handling payments, etc..

## Why I did it

I absolutely hate the design of Online Scout Manager, so I decided to make an app. They provide an API for getting information like upcoming events and the current programme. I asked for an API key which after testing, only worked with leader accounts (I had a parent account). So I had to revert to observing web requests and parsing webpages.

## Screenshots

<details>
  <summary>View Screenshots</summary>
  ![](http://i.imgur.com/zCLI7S3.png)
  ![](http://i.imgur.com/YmN1EvM.png)
  ![](http://i.imgur.com/FJttyk5.png)
  ![](http://i.imgur.com/Bn0weYu.png)
  ![](http://i.imgur.com/CkFrqbu.png)
  ![](http://i.imgur.com/MSdAsIU.png)
</details>

## Features

- [x] Events List
- [x] Event Details
- [x] Programme List
- [ ] Offline Support

## Getting Started

```
npm install -g cordova ionic
git clone https://github.com/jake-walker/osm-app.git
cd osm-app
```

Try it in your browser: `ionic serve`

Build: `ionic build android`, `ionic build ios`.

## Download

See the [releases page](https://github.com/jake-walker/osm-app/releases/) for the latest build.

### Installing on Android

To install APKs on Android manually you will need to open your Settings app, scroll down to Security and then check Unknown Sources. You can then download the APK on your device through the browser or by downloading it on your computer and copying it to your device. Then, open your file manager (if you don't have one installed, most are free on the Play Store) and locate the downloaded `.APK` file and press it to open the installer. **It is recommended to turn off Unknown Sources after you have finished installing it.**
