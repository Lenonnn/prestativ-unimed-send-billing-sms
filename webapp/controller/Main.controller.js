sap.ui.define([
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
              Fragment,
              JSONModel,
              MessageBox) {
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

            onSendNewMessage: async function(){

                this.byId("btnSendNewMessage").setPressed(false);
                await this._loadFragmentScheduleSMS();

            },
            onSendSMS: function(){

            },
      
            onExit: function (oEvent) {
                this._oDialog.close();
            },

            _loadFragmentScheduleSMS: async function () {
                if (!this._oDialog) {
                  this._oDialog = new Fragment.load({
                    id: this.getView().getId(),
                    name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.MaintenenceSMSMessages2",
                    controller: this,
                  });
      
                  await this._oDialog
                    .then(
                      function (oFragment) {
                        this.getView().addDependent(oFragment);
                        this._oDialog = oFragment;
                      }.bind(this)
                    )
                    .catch(function (oError) {
                      console.log(oError);
                    });
                }
                this._oDialog.open();
            },

		onFilter: function(oEvent) {
			// var sValue = oEvent.getParameter("value");
      // var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
      // var oBinding = this.byId("table").getBinding("items");
      // oBinding.filter([oFilter]);
		},

        });
    });
