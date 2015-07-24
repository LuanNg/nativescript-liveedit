#!/usr/bin/env node
/**********************************************************************************
 * (c) 2015, Master Technology
 * Licensed under the MIT license or contact me for a Support or Commercial License
 *
 * I do contract work in most languages, so let me solve your problems!
 *
 * Any questions please feel free to email me or put a issue up on the github repo
 * Version 0.0.2                                      Nathan@master-technology.com
 *********************************************************************************/
"use strict";

var os = require('os');
var crypto = require('crypto');
var fs = require('fs');

var x86FileHashes = {
    // These are the original NativeScript versions
    "d940a07169e73b593962b11f14c8513d220e7cbf": {version: "0.9.0", liveSync: false, upgrade: true},
    "f475ef124706a29fb597d855b4df536c5ae35730": {version: "1.0.0", liveSync: false, upgrade: true},
    "c7635ac8a9bd5a1ea8ab32ad2ec555f47625caaf": {version: "1.1.0", liveSync: false, upgrade: true},
	"7b4506c52b1f190b1d2c638dec30c54399ee61ff": {version: "1.2.0", liveSync: false, convert: true},

    // These are my Compiled versions
    "7323199e7b6475bd2c4dd2691857752b170fd2a6": {version: "1.0.0", liveSync: true, upgrade: true},
    "60607640311349f9899c50115abf9c25e0c0c9be": {version: "1.1.0", liveSync: true, upgrade: true},
	"405170e1b37558bd87ab37274e623a195391ac7f": {version: "1.2.0", liveSync: true}
};

var armFileHashes = {
    // These are the Original NativeScript Versions
    "d494826d6fb9aa96b93ea35a0471f75555c2c922": {version: "0.9.0", liveSync: false, upgrade: true },
    "5b4e521c8845aeeb63597f204c2fc5eed35023ff": {version: "1.0.0", liveSync: false, upgrade: true },
    "c2624393dbc4abedb97b04dfea30011dcc05f107": {version: "1.1.0", liveSync: false, upgrade: true },
	"d49323c3174a3f427474f57e9374b9ddad28a351": {version: "1.2.0", liveSync: false, convert: true },

    // These are my Compiled Versions
    "13b37548e2680afc12665c4771cc1d0489f9c513": {version: "1.0.0", liveSync: true, upgrade: true },
    "f942519dec81124584d418d40eaefbb3860c2912": {version: "1.1.0", liveSync: true, upgrade: true },
	"9b42b4c7c8d891f344b83d4e1c44db6d43bff60b": {version: "1.2.0", liveSync: true}
};


function getVersion() {
    var key, version="0.0.0";
    for (key in x86FileHashes) {
        if (x86FileHashes.hasOwnProperty(key)) {
            if (version <  x86FileHashes[key].version) {
                version = x86FileHashes[key].version;
            }
        }
    }
    for (key in armFileHashes) {
        if (armFileHashes.hasOwnProperty(key)) {
            if (version <  armFileHashes[key].version) {
                version = armFileHashes[key].version;
            }
        }
    }
    return version;
}

var currentVersion = getVersion();
getFileSha("../../platforms/android/libs/x86/libNativeScript.so", checkHash);
getFileSha("../../platforms/android/libs/armeabi-v7a/libNativeScript.so", checkHash);

function displayUpgrade(version) {
    console.error("---------------------------------------------------------------------------------------------------\n",
        "Your version (", version, ") of the Platform Android runtimes are outdated!\n The current version is: ",currentVersion,"  Please upgrade your runtimes by doing a:\n   >tns platform update android\n Then you need to redo the installation of this plugin\n   >tns plugin add nativescript-livesync",
		"If upgrading is not a options, download this plugin tagged to your current runtimes. using the tag @ns" + version + "  to specify the specific version.",
        "\n---------------------------------------------------------------------------------------------------\n");
    process.exit(0);
}

var cnt = 0;
function checkHash(v) {
    cnt++;

    if (!armFileHashes[v] && !x86FileHashes[v]) {
        console.error("---------------------------------------------------------------------------------------------------\n",
            "This version of LiveSync does not support the version of the Android runtimes you have.\n This is probably because you have updated to a newer version of the NativeScript Android runtimes.\n","A new version of NativeScript-LiveSync should be released shortly.",
            "\n---------------------------------------------------------------------------------------------------\n");
        process.exit(0);
    }
    var convert = false, liveSync = false;
    if (armFileHashes[v]) {
        if (armFileHashes[v].upgrade) {
            displayUpgrade(armFileHashes[v].version);
        }
        convert = !!armFileHashes[v].convert;
        liveSync = !!armFileHashes[v].liveSync;
    } else {
        if (x86FileHashes[v].upgrade) {
            displayUpgrade(x86FileHashes[v].version);
        }
        convert = !!x86FileHashes[v].convert;
        liveSync = !!x86FileHashes[v].liveSync;
    }

    if (cnt >= 2) {
        if (liveSync) {
            console.error("---------------------------------------------------------------------------------------------------\n",
                "You are already running the current LiveSync runtimes.  Updating just the LiveSync Javascript...",
                "\n---------------------------------------------------------------------------------------------------\n");
        } else if (convert) {
            console.error("---------------------------------------------------------------------------------------------------\n",
                "Installing the LiveSync version of the runtimes....",
                "\n---------------------------------------------------------------------------------------------------\n");
        }

        copyFiles(convert);
    }
}

function copyFile(src, dest, forceOverWrite) {
    if (!forceOverWrite && fs.existsSync(dest)) return;
    var buffer = fs.readFileSync(src);
    fs.writeFileSync(dest, buffer);
}

function copyFiles(convert) {
    copyFile("./support/watcher.js","../../watcher.js", true);
    copyFile("./support/.jshintrc","../../.jshintrc", false);
    if (convert) {
        copyFile("./platforms/android/libs/armeabi-v7a/libNativeScript.so", "../../platforms/android/libs/armeabi-v7a/libNativeScript.so", true);
        copyFile("./platforms/android/libs/x86/libNativeScript.so", "../../platforms/android/libs/x86/libNativeScript.so", true);
    }

    // Delete these files so that they don't end up in the compiled project,
    // the tns plugin command is simple stupid in that it copies everything to the platforms/.../tns_modules/nativescript-livesync folder
    // However, later it cleans up after itself; but this is more of a precaution so that they files never end up in that folder.
    fs.unlinkSync("./platforms/android/libs/armeabi-v7a/libNativeScript.so");
    fs.unlinkSync("./platforms/android/libs/x86/libNativeScript.so");
    fs.unlinkSync("./support/watcher.js");
    fs.unlinkSync("./support/.jshintrc");
    fs.unlinkSync("./support/postinstall.js");

    process.exit(0);
}


function getFileSha(filename, callback) {
    var shaSum = crypto.createHash('sha1');
    if (!fs.existsSync(filename)) {
        console.error("---------------------------------------------------------------------------------------------------\n",
            "Unable to find the Android Runtimes.  Please make sure that you have done a\n   >tns platform add android\n","Then re-run the adding of this plugin.",
            "\n---------------------------------------------------------------------------------------------------\n");
        process.exit(0);
    }
    var readStream = fs.createReadStream(filename);
    readStream.on('data', function(d) {
        shaSum.update(d);
    });

    readStream.on('end', function() {
        var d = shaSum.digest('hex');
        callback(d);
    });
}

