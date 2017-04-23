# Online Scout Manager App

[Download](#download)

> I don't own Online Scout Manager!

[Online Scout Manager](https://www.onlinescoutmanager.co.uk/) is a website which allows people running scout troops to have less admin by handling payments, etc..

## Why I did it

I absolutely hate the design of Online Scout Manager, so I decided to make an app. They provide an API for getting information like upcoming events and the current programme. I asked for an API key which after testing, only worked with leader accounts (I had a parent account). So I had to revert to observing web requests and parsing webpages.

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
