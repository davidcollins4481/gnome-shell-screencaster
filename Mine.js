'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const SCREENCAST_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.screencaster';
const SAVE_TO_DIRECTORY = 'save-to-directory';
const FILE_FORMAT = 'file-format';

// dbus-send --print-reply --dest=org.gnome.Shell /org/gnome/Shell/Screencast org.freedesktop.DBus.Introspectable.Introspect

var Screencast = function() {
    this.dbusInterface = '<node><interface name="org.gnome.Shell.Screencast">\
	    <method name="Screencast">\
	      <arg type="s" name="file_template" direction="in">\
	      </arg>\
	      <arg type="a{sv}" name="options" direction="in">\
	      </arg>\
	      <arg type="b" name="success" direction="out">\
	      </arg>\
	      <arg type="s" name="filename_used" direction="out">\
	      </arg>\
	    </method>\
	    <method name="ScreencastArea">\
	      <arg type="i" name="x" direction="in">\
	      </arg>\
	      <arg type="i" name="y" direction="in">\
	      </arg>\
	      <arg type="i" name="width" direction="in">\
	      </arg>\
	      <arg type="i" name="height" direction="in">\
	      </arg>\
	      <arg type="s" name="file_template" direction="in">\
	      </arg>\
	      <arg type="a{sv}" name="options" direction="in">\
	      </arg>\
	      <arg type="b" name="success" direction="out">\
	      </arg>\
	      <arg type="s" name="filename_used" direction="out">\
	      </arg>\
	    </method>\
	    <method name="StopScreencast">\
	      <arg type="b" name="success" direction="out">\
	      </arg>\
	    </method>\
	  </interface></node>\
	';

    this.proxy = Gio.DBusProxy.makeProxyWrapper(this.dbusInterface);
    this._settings = Convenience.getSettings(SCREENCAST_SETTINGS_SCHEMA);

    this.obj = new this.proxy(
        Gio.DBus.session,
        "org.gnome.Shell.Screencast", // busname
        "/org/gnome/Shell/Screencast" // interface
    );

    let that = this;

    let getFileName = function() {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        let name = that._settings.get_string(FILE_FORMAT);
        return name.replace('%d', dateString);
    };

    let getDirectory = function() {
        return that._settings.get_string(SAVE_TO_DIRECTORY);
    };

    return {
        start: function(callback) {
            callback = typeof(callback) === "undefined" ? function() {} : callback;
            let path = getDirectory() + "/" + getFileName();
            that.obj.ScreencastRemote(path, [], callback);
        },

        stop: function(callback) {
            callback = typeof(callback) === "undefined" ? function() {} : callback;
            that.obj.StopScreencastRemote(callback);
        }
    };
}
