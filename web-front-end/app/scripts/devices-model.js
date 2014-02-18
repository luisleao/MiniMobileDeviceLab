/**
Copyright 2013 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
'use strict';

/*jshint sub:true*/
function DevicesModel(token) {
    var idToken = token;
    var devices = null;
    var platforms = null;

    this.getIDToken = function() {
        return idToken;
    };

    this.getCachedDevices = function() {
        return devices;
    };

    this.setCachedDevices = function(d) {
        platforms = [];
        devices = {};

        var device;
        for(var i = 0; i < d.length; i++) {
            device = d[i];
            if(typeof platforms[device['platform_id']] === 'undefined') {
                platforms[device['platform_id']] = [];
            }

            platforms[device['platform_id']].push(device.id);
            devices[device.id] = device;
        }
    };

    this.getPlaforms = function() {
        return platforms;
    };
}

DevicesModel.prototype.getDevices = function(successCb, errorCb) {
    var devices = this.getCachedDevices();
    if(devices === null) {
        this.updateCachedDevices(function() {
            successCb(this.getCachedDevices());
        }.bind(this), errorCb);
    } else {
        successCb(devices);
    }
};

DevicesModel.prototype.getPlatforms = function(successCb, errorCb) {
    var platforms = this.getPlaforms();
    if(platforms === null) {
        if(this.getCachedDevices() === null) {
            // We haven't initialised
            this.updateCachedDevices(function() {
                successCb(this.getPlaforms());
            }.bind(this), errorCb);
        } else {
            // Devices exist, but we just have no valid platforms
            successCb([]);
        }
    } else {
        successCb(platforms);
    }
};


DevicesModel.prototype.updateCachedDevices = function(successCb, errorCb) {
    var config = new Config();
    var idToken = this.getIDToken();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', config.getRootUrl()+'/devices/get/', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function(e) {
        if (e.target.readyState === 4) {
            if(e.target.status !== 200) {
                errorCb();
                return;
            } else {
                var response = JSON.parse(xhr.responseText);
                this.setCachedDevices(response.data);
                successCb();
            }
        }
    }.bind(this);

    var paramString = 'id_token='+encodeURIComponent(idToken);
    xhr.send(paramString);
};

DevicesModel.prototype.getDeviceById = function(deviceId) {
    return this.getCachedDevices()[deviceId];
};

DevicesModel.prototype.removeDevice = function(deviceId, successCb, errorCb) {
    /* jshint unused: false */
    window.alert('device-list-controller.js: removeDevice() needs implementing');
};

DevicesModel.prototype.changeDeviceName = function(deviceId, successCb, errorCb) {
    /* jshint unused: false */
    window.alert('device-list-controller.js: changeDeviceName() needs implementing');
};

DevicesModel.prototype.changeDeviceBrowser = function(deviceId, successCb, errorCb) {
    /* jshint unused: false */
    window.alert('device-list-controller.js: changeDeviceBrowser() needs implementing');
};