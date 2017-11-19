const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Config = imports.misc.config;
const EXTENSIONDIR = Me.dir.get_path();
const Gettext = imports.gettext.domain('gnome-shell-extension-screencaster');
const _ = Gettext.gettext;
const Convenience = Me.imports.convenience;
const SCREENCAST_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.screencaster';

const ScreencasterPrefsWidget = new GObject.Class({
    Name: 'Screencaster.Prefs.Widget',
    GTypeName: 'ScreencasterExtensionPrefsWidget',
    Extends: Gtk.Box,

    _init: function(params) {
        this.parent(params);
        this._settings = Convenience.getSettings(SCREENCAST_SETTINGS_SCHEMA);
        // Create user-agent string from uuid and (if present) the version
        this.user_agent = Me.metadata.uuid;
        if (Me.metadata.version !== undefined && Me.metadata.version.toString().trim() !== '') {
            this.user_agent += '/';
            this.user_agent += Me.metadata.version.toString();
        }

        this.initWindow();

        this.mainWidget = this.Window.get_object("main-box");
        this.fileFormat = this.Window.get_object("file-format");

        let savedStocks = this._settings.get_string("file-format");
        this.fileFormat.clear();
       // this.tickerAdd.connect('clicked', Lang.bind(this, this.addTickerSymbol));

       // this.Window.get_object("add-ticker-cancel").connect("clicked", Lang.bind(this, function() {
       //     this.newTicker.hide();
       // }));

    },

    Window: new Gtk.Builder(),

    initWindow: function() {
        this.Window.add_from_file(EXTENSIONDIR + "/ui/settings.ui");
    }
});


function init() {
}

function buildPrefsWidget() {
    let prefs = new ScreencasterPrefsWidget();
    let widget = prefs.mainWidget;
    widget.show_all();
    return widget;
}
