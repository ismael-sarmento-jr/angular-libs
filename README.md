# Main Projects

[Ionic Angular Extensions](./projects/ionic-angular-ext)

# Config

This repository has a base project called angular-libs that contains diverse lib projects inside its folder `./projects`

```
// angular-Libs was created with following commands
mkdir angular-libs
ng new angular-libs --create-application=false

// To generate lib projects:
ng generate library my-new-lib

// add dependencies to 'peerDependencies' and 'dependencies' my-new-lib entries package.json sections (or just to peerDependencies if lib consumer has to install them) then issue install:
npm install <dep> --save-dev

// to build the project and watch for subentries change, so it only rebuilds the changed subentry*, inside the entry
ng build --watch

// to create a local symbolic link in npm so we don't need to publish to a repo, inside './dist/my-new-lib':
npm link

// to use the link, inside the lib consumer project (the consumer link might get erased on lib update/watch, so just issue the command whenever needed):
npm link my-consumer-proj
```
_(*) Npm libs don't support deep link; additional information on creating subentries for the lib: [creating-secondary-entry-points-for-your-angular-library](https://medium.com/tunaiku-tech/creating-secondary-entry-points-for-your-angular-library-1d5c0e95600a)_


If an entry in a project is too big, edit its package.json scripts to use adequate memory to its size:

```
"scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build",
    "build-prod": "node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --prod",
    "watch": "node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --watch --configuration development",
    "test": "ng test"
  }
```
