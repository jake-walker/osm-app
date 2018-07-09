<h1 align="center">
  <img
    style="border-radius: 5px;"
    src="resources/android/icon/drawable-xhdpi-icon.png">
</h1>

<h2 align="center">
  Scout Penknife
</h2>

<p align="center">
  <a href="https://github.com/jake-walker/scout-penknife/releases/">
    <img
      alt="GitHub (pre-)release"
      src="https://img.shields.io/github/release/jake-walker/scout-penknife/all.svg?style=for-the-badge">
  </a>
</p>



## Features

- [x] Online Scout Manager Support *(parent accounts only)*
  - [ ] Read
    - [ ] Notices
    - [ ] Payments
    - [x] Events
    - [x] Programme
    - [ ] Badges
  - [ ] Write
    - [ ] Events - Confirm Attendance
  - [ ] Offline Support

## Building

```
npm install -g cordova ionic
git clone https://github.com/jake-walker/scout-penknife.git
cd scout-penknife
```

Then build your own version with:

```
ionic build android
ionic build ios
```

See [Ionic Documentation](http://ionicframework.com/docs/v1/guide/publishing.html) for more info on building apps.

## Download

See the [releases page](https://github.com/jake-walker/scout-penknife/releases/) for the latest build.

### Manually Installing on Android

To install APKs on Android manually you will need to open your Settings app, scroll down to Security and then check Unknown Sources. You can then download the APK on your device through the browser or by downloading it on your computer and copying it to your device. Then, open your file manager (if you don't have one installed, most are free on the Play Store) and locate the downloaded `.APK` file and press it to open the installer. **It is recommended to turn off Unknown Sources after you have finished installing it.**
