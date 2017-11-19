const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
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

// SCHEMA KEYS
const SAVE_TO_DIRECTORY = 'save-to-directory';
const FILE_FORMAT = 'file-format';

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

        this.mainWidget = this.Window.get_object('main-box');
        this.fileFormat = this.Window.get_object('file-format');
        this.saveFolder = this.Window.get_object('save-to-folder');
        this.okBtn = this.Window.get_object('ok-btn');
        this.cancelBtn = this.Window.get_object('cancel-btn');

        this.fileFormat.set_text(this._settings.get_string(FILE_FORMAT));

        let destinationFolder = this._settings.get_string(SAVE_TO_DIRECTORY);
        destinationFolder = destinationFolder.replace('%HOME%', GLib.get_home_dir());
        this.saveFolder.set_current_folder(destinationFolder);

        let that = this;
        this.saveFolder.connect('file-set', Lang.bind(this, function(chooser) {
            that._settings.set_string(SAVE_TO_DIRECTORY, chooser.get_filename());
        }));

        this.okBtn.connect('clicked', Lang.bind(this, function() {
            this._settings.set_string(FILE_FORMAT, this.fileFormat.get_text());
            this.mainWidget.parent.hide();
        }));

        this.cancelBtn.connect("clicked", Lang.bind(this, function() {
            this.mainWidget.parent.hide();
        }));
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
