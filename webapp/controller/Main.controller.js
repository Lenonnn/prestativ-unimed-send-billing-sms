sap.ui.define([
    "./BaseController",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,) {
        "use strict";

        return BaseController.extend("com.unimed.prestativ.zfisendbillingsms.controller.Main", {
            onInit: function () {
                this.oFileModel = this.getOwnerComponent().getModel();
            },

            onAfterRendering: function (oEvent) {
                // RsponsiveTable in MultiSelect
                this.getView().byId("smartTable").getTable().setMode("MultiSelect");
                this.getView().byId("smartTable").getTable().setGrowing(true);
                this.getView().byId("smartTable").getTable().setGrowingThreshold(10);
                this.byId("btnSendNewMessage").setEnabled(true);
            },

            onBegin: function(){
                console.log("Begin was pressed") ;
            },

            onSendNewMessage: function(){
                this.byId("btnSendNewMessage").setPressed(false);
            },

        });
    });
