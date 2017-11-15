const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Mine = Me.imports.Mine;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let button, screencast, screencastingId;

const ScreencastPopupMenu = new Lang.Class({
    Name: "ScreencastPopupMenu",
    Extends: PopupMenu.PopupMenu,

    _init: function(info) {
        this.parent();
    }
});

const ScreencastButton = new Lang.Class({
    Name: 'ScreencastButton',
    Extends: PanelMenu.Button,

    _init: function(){
        this.parent(0.0);
        this._id = 0;
        let label = new St.Label({text: 'Screencast'});
        this.actor.add_child(label);

        let startScreencastItem = new PopupMenu.PopupMenuItem('Start Screencast');
        let that = this;
        startScreencastItem.actor.connect('button-press-event', function(){
            that._id = Mainloop.timeout_add(100, Lang.bind(this, function() {
                log('starting..');
                screencast.start(function(resp, error) {
                   if (!error) {
                       startScreencastItem.actor.reactive = false;
                   }
               });

               return GLib.SOURCE_REMOVE;
           }));
       });

       let stopScreencastItem = new PopupMenu.PopupMenuItem('Stop Screencast');
       stopScreencastItem.actor.connect('button-press-event', function(){
           screencast.stop();
           startScreencastItem.actor.reactive = true;
       });

       this.menu.addMenuItem(startScreencastItem);
       this.menu.addMenuItem(stopScreencastItem);
    }
});

function init() {
    screencast = new Mine.Screencast();
    // (role, indicator, position, boxj
    // https://github.com/GNOME/gnome-shell/blob/master/js/ui/panel.js
    Main.panel._addToPanelBox('Screencast-container', new ScreencastButton(), 1, Main.panel._rightBox);
}

function enable() {
}

function disable() {
    button.destroy();
}
