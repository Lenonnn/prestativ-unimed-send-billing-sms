sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/unimed/prestativ/zfisendbillingsms/model/models",
        "./library/moment.min"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.unimed.prestativ.zfisendbillingsms.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // Set properties to show aplication in full screen mode
                // let oRootView = this.getRootControl();
                // console.log("O Root View: ", oRootView)
                // oRootView.setProperty("fullWidth", true);
                // oRootView.setProperty("fullHeight", true);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                
            }
        });
    }
);