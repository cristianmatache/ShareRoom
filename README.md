# ShareRoom
Software Engineering 3rd Year Group Project
Please read the tutorials and the instalation guides if you want to clone properly so you don't have to get `mad`.
## Installation
1. Install [Node.js](https://nodejs.org/en/download/package-manager/) if you don't have it, you can either install it with `brew install node` or download it
2. After that you need [Ionic framework](https://ionicframework.com/getting-started/), if you don't have it install it with `npm install -g cordova ionic` (probably need `sudo` which is problematic for Computing labs). If it doesn't work on Computing labs try without the `-g` flag while in the project root folder

## New Clone
1. Run `npm install` all the time you clone a new repo in oreder to install all dependencies. Otherwise the thing won't compile or work properly
2. Always save new npm packages `npm install -s {package_name}`. **The `-s` flag is really important because it adds the package to the packages.json file wich is the dependencies list**

## Development
1. Run `ionic serve` to run the development environment. You can use `ionic serve --lab` to see all platforms side by side
2. Every time you install a new package **don't forget** about the `-s` flag

## Technologies
We will be using the following technologies:
1. [Firebase](https://firebase.google.com/docs/reference/js/)
2. [Ionic framework](https://ionicframework.com/docs/api/)
3. [AngularJS v2](https://angular.io/api)
4. [Typescript](https://www.typescriptlang.org/play/index.html)

## Typescript
There is a tutorial [here](https://www.youtube.com/watch?v=-PR_XqW9JJU) which covers everything you need to know about typescript.
Please set a type for any variable. **Don't leave it as `any`, it is really bad.**
If you don't know what you are doing think of it as what would you do in java. You can also find a playground [here](https://www.typescriptlang.org/play/index.html) to see how the code is transpiled.

## AngularJS
Really good basic tutorial [here](https://www.youtube.com/watch?v=_-CD_5YhJTA) (You can skip the installation part as it is not the case here).
If you are getting familiar with it please start skiming through the [API](https://angular.io/api).

## Ioninc
Not really much to say. It is very easy and intuitive, **but** there is a major issue, if there is an element such as `<input />` **you have to** use the ionic version of it `<ion-input />` or whatever in oreder for the application to work properly. Read through [here](https://ionicframework.com/docs/api/) to see the available components.

## Firebase
Just leaf through the [API](https://firebase.google.com/docs/reference/js/). Really easy to use if you know what is a json.
1. [Tutorial 1](https://www.youtube.com/watch?v=twmh82lvs1Q)
2. [Tutorial 2](https://www.youtube.com/watch?v=F6UWb9FNnj4)
