# NativeScript Real time LiveSync

A NativeScript module providing real time development for Android.  

## License

All this code is (c)2015, Master Technology.   This is released under the MIT License, meaning you are free to include this in any type of program -- However for entities that need a support, changes, enhancements and/or a commercial license please contact me (nathan@master-technology.com).

I do contract work; so if you have a module you want built for NativeScript (or pretty much any other language) feel free to contact me.

## Differences between Telerik LiveSync & Master Technology LiveSync

In the new version v1.2.0 of the NativeScript command line tools; Telerik has now released a *limited* LiveSync (or what I consider a DeadSync command. :grinning: ).  The differences from my LiveSync and Telerik's LiveSync is substantial enough that I will continue to use and maintain my version for the foreseeable future.

#### Pros of Telerik's LiveSync:
* No extra code added to your application!
* Possibly works on Real IOS Devices (Untested on real device, but does not currently appear to work on a IOS Simulator)

#### Cons of Telerik's LiveSync:
* Not really Live.  It syncs the files; but then has to restart the application from scratch, no matter what file is changed.
* Delays while it detects any changes and then deploys the changes.  
* Delays while it is re-launching Application.
* Loss of all application state since it reloads the app on every change.  
* If you navigated three screens deep, and make a CSS file change; you will need to re-navigate to that screen again to see it.
* Incredibly slow LiveSync startup time.  (What in the world is it doing for about a minute?)
* Can crash the LiveSync watcher code easily (don't change any files in the tns_modules!).
* Does not apparently detect any new files...
* Reset of the Application even if you change a file that isn't even being used.
* Easy to crash your application as the JavaScript and XML are not checked before being sent to the application.

#### Con's of Master Technology's LiveSync:
* Until Telerik accepts the patch; you have to use the included patched runtime.  (Please vote up the issue!)
* Added coded to your project.
* Only works on the Android platform, no IOS support. 

#### Pro's of Master Technology's LiveSync:
* Live, You see the app change almost exactly when your editor saves the files.
* New files are detected and synced instantly.
* Application state is almost always fully maintained.  
* The screen you are working on only reloads ONLY if it is the code you just changed.
* Built in ability to detect errors in XML and JS before pushing to device to eliminate crashing the app on the device.
* Ability to only reload application on files that are singletons or other files that you would rather have the app reloaded for.
* Ability to restart application by touching or creating a "restart.livesync" file.

This is currently setup to work with V1.2.0 of NativeScript runtimes, if you need upgrade instructions to upgrade to NativeScript 1.2.0 from your version please see: [http://fluentreports.com/blog/?p=88](http://fluentreports.com/blog/?p=88).
  
The iOS side is currently just a simple DUMMY WRAPPER so that any usage you use on the Android side will not cause any issues when you deploy to your iOS devices/emulator. 




## Real Time LiveSync Demo

[![Video Showing off Real Time LiveSync Development Ability](http://img.youtube.com/vi/cCiyJZexSOQ/0.jpg)](http://www.youtube.com/watch?v=cCiyJZexSOQ)


## VERY IMPORTANT NOTES

If you want to use this in it's **AWESOME real time LiveSync mode**, you **MUST** be running a patched android runtime.   I have added code to disable it in the event the support is not detected.  And it will tell you it is disabled in the log! 
Again this currently requires the Android Runtime to be patched with an addition call so please up-vote the pull request so this is no longer needed:
[https://github.com/NativeScript/android-runtime/pull/92](https://github.com/NativeScript/android-runtime/pull/92)
However, until this patch is accepted by Telerik; this plugin module now includes the patched runtimes for the latest version of nativescript.   It should now auto-install the patched runtimes for you!  

If you want to compile the runtimes your self; you can clone the latest runtime, and manually patch it with my above patch, and then install the runtime following the latest documentation. [http://docs.nativescript.org/running-latest](http://docs.nativescript.org/running-latest)

Please note the watcher specifically does NOT watch the **App_Resources** folders, mainly because this folder must be built, as these are compiled resources.     
Please note the device code does not have any code to start watching any new folders when they are added; as I have a billion other things on my list that affects me more.  So this is a very low priority to actually code it up, I would gladly take pull requests that fixes this, if you find this too annoying.
            
## Installation

### If Upgrading
Delete the old app\node_modules\nativescript-livesync folder, as the new node_modules plugin folder is now located in the root folder.

### Prerequisites: 
Run `npm install jshint -g`

If you don't have xmllint already on your machine; you will need to install it. (Windows users: http://xmlsoft.org/sources/win32/)


### NativeScript Command line Version 1.1.3+
Run `tns plugin add nativescript-livesync`

### NativeScript Command Line Version Earlier
Run `npm install nativescript-livesync --save` from your project's `root` directory, then copy/move the node_modules\nativescript-livesync folder to app\tns_modules

## Usage & Running

To use the livesync module you must first `require()` it.

```js
var livesync = require("nativescript-livesync" );
```

You should as a minimum put this in your **app.js** like so:
```js
var application = require("application");
application.mainModule = "main-page";
// ----- MODIFY THIS LINE -----
application.cssFile = "app.css"; // this was "./app.css"
// ----------------------------

// ---- ADD THIS LINE ----
require('nativescript-livesync');
// -----------------------

application.start();
```

Then this will activate at the start of the application and work for the entire time, also notice the removal of the "./" in the cssFile.   

## Magic Restart Files
Changes in these files will automatically cause the application to restart on the device or emulator.
* app.js
* restart.livesync
* Any other file you add via the **restartFile** command described below.


## Get the LiveSync object
```var livesync = require('nativescript-livesync');```

### Methods

#### addModelPageLink(Page, Model)
##### Parameters
* Page - this is the page that the model is related too.
* Model - this is the model that relates to the page

#### ignoreFile(Page)
##### Parameters
* Page - this is the file to totally ignored for sending as updates.
You can call this multiple times and it will just add it to a list of files to ignore.

#### restartFile(Page)
##### Parameters
* Page - this is the file to cause the app on the client to restart.    
You can call this multiple times and it will just add it to a list of files to restart on.
By default, app.js and restart.livesync are in this list.

#### enabled(value) 
##### Parameters
* (no parameter) will return if it is enabled
* (value) - set it to be enabled (true) or disabled (false)

#### debugMode(value)
##### Parameters 
* (no Parameter) will return if it is running in debugMode 
* (value) - set it to be forced into or out of debugMode, rather than letting it use the detection method.

#### getAppName()
This will return the package name in the from the AndroidManifest

#### getAppVersion()
This will return the VersionName from inside the AndroidManifest

#### restart()
This will fully restart the application -

#### checkForEmulator()
This will check to see if the app is running on a emulator

#### checkForDebugMode()
This will check to see if the app was signed with a debug key (i.e. debug mode)

#### reloadPage()
This will reload the current page

#### isSuspended()
This will tell you if the application is suspended.  (i.e. some other app has focus)

#### currentAppPath()
This will return the current application path.
