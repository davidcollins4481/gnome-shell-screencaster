'use strict';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
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

    this.obj = new this.proxy(
        Gio.DBus.session,
        "org.gnome.Shell.Screencast", // busname
        "/org/gnome/Shell/Screencast" // interface
    );
}

Screencast.prototype.start = function(callback) {
    callback = typeof(callback) === "undefined" ? function() {} : callback;
    this.obj.ScreencastRemote("/home/dave/Desktop/cast", [], callback);
};

Screencast.prototype.stop = function(callback) {
    callback = typeof(callback) === "undefined" ? function() {} : callback;
    this.obj.StopScreencastRemote(callback);
}
