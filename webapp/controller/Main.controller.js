sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/Formatter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, Fragment, JSONModel, MessageBox, Formatter) {
    "use strict";

    return BaseController.extend(
      "com.unimed.prestativ.zfisendbillingsms.controller.Main",
      {
        formatter: Formatter,

        onInit: function () {
          // Get model when app start run
          this.oFileModel = this.getOwnerComponent().getModel();
        },

        onAfterRendering: function (oEvent) {
          // RsponsiveTable in MultiSelect
          this.getView().byId("smartTable").getTable().setMode("MultiSelect");
          this.getView().byId("smartTable").getTable().setGrowing(true);
          this.getView().byId("smartTable").getTable().setGrowingThreshold(10);
          this.byId("btnSendNewMessage").setEnabled(true);
        },

        onBegin: function () {
          console.log("Begin was pressed");
        },

        onSendNewMessage: async function () {
          this.byId("btnSendNewMessage").setPressed(false);
          await this._loadFragmentScheduleSMS();
        },

        onListMessages: async function () {
          this.byId("btnListMessages").setPressed(false);
          await this._loadFragmentMaintenenceSMS();
        },

        onSendSMS: function () {},
        onSaveSMS: function () {},

        onExit: function (oEvent) {
          this._oDialog.close();
        },
        onExitSMS: function (oEvent) {
          this._oDialogM.close();
        },
        onExitSMSDetails: function (oEvent) {
          this._oDialogSMSDetail.close();
        },

        onRBChange: function (oEvent) {
          let sendDefinition = oEvent.getParameter("id");

          if (sendDefinition.indexOf("RB1") !== -1) {
            this.getView().byId("iptDate").setEnabled(true);
          } else {
            this.getView().byId("iptDate").setEnabled(false);
            this.getView().byId("iptDate").setValue("");
          }
        },

        onFilter: function (oEvent) {
          // var sValue = oEvent.getParameter("value");
          // var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
          // var oBinding = this.byId("table").getBinding("items");
          // oBinding.filter([oFilter]);
        },

        onCreateSMS: async function (oEvent) {
          await this._loadFragmentMessageSMSDetails();
        },

        onReadSMS: async function (oEvent) {
          await this._loadFragmentMessageSMSDetails();
        },

        onUpdateSMS: async function (oEvent) {
          await this._loadFragmentMessageSMSDetails();
        },

        onDeleteSMS: async function (oEvent) {
          await this._loadFragmentMessageSMSDetails();
        },

        _loadFragmentScheduleSMS: async function () {
          if (!this._oDialog) {
            this._oDialog = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.SendSMSMessage",
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

        _loadFragmentMaintenenceSMS: async function () {
          if (!this._oDialogM) {
            this._oDialogM = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.MaintenenceSMSMessages",
              controller: this,
            });

            await this._oDialogM
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogM = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogM.open();
        },
        _loadFragmentMessageSMSDetails: async function () {
          if (!this._oDialogSMSDetail) {
            this._oDialogSMSDetail = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.MessageDetails",
              controller: this,
            });

            await this._oDialogSMSDetail
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogSMSDetail = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogSMSDetail.open();
        },

        

      }
    );
  }
);
