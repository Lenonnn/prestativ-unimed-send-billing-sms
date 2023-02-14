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

        onSendSMSToSchedule: function () {
          let oIdentifier = '';
          let oTitle = '';
          let oText = '';

        },

        // Leave send message page
        onExit: function (oEvent) {
          this._oDialog.close();
        },

        // Close main pop-up for SMS maintence view
        onExitSMSPopUp: function (oEvent) {
          this._oDialogM.close();
          this.getModel().byId("idTableSMS").refresh(true);
        },
        
        // Leave update SMS pop-up
        onExitSMSUpdate: function (oEvent) {
          this._oDialogSMSUpdate.close();

          // this.byId("ipUpdtSMS").setEditable(false);
          // this.byId("ipUpdtIdentification").setEditable(false);
          this.byId("idUpdtTitle").setEditable(true);
          this.byId("idUpdtSSMText").setEditable(true);
          this.byId("btnSaveUpdate").setEnabled(true);
        },

        // Leave create new SMS pop-up
        onExitSMSCreate: function (oEvent) {

          this._oDialogSMSCreate.close();

          this.byId("ipCreateIdentification").setEditable(true);
          this.byId("idCreateTitle").setEditable(true);
          this.byId("idCreateSSMText").setEditable(true);
          this.byId("btnSave").setEnabled(true);

          let clear = '' ;

          this.byId("ipCreateIdentification").setValue(clear);
          this.byId("idCreateTitle").setValue(clear);
          this.byId("idCreateSSMText").setValue(clear);

          this.getView().getModel().byId("idTableSMS").refresh(true);


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

        onCallPopUpCreateSMS: async function (oEvent) {
          await this._loadFragmentMessageSMSCreate();
        },

        onCallPopUpUpdateSMS: async function (oEvent) {

          let oSMS = this.getView().byId("idTableSMS").getSelectedItem();

          if ( oSMS === null ){
            MessageBox.alert("Selecione uma mensagem para atualizar")
          }else{

            let oEntry = oSMS.getBindingContext().getObject();

            if ( oEntry.IdSMS !== null && oEntry.IdSMS !== undefined ) {

              // let oUpdateForm = sap.ui.getCore().byId("formUpdate");
              await this._loadFragmentMessageSMSUpdate();

              // console.log(oUpdateForm);
              // console.log(oEntry);
              this.byId("ipUpdtSMS").setValue(oEntry.IdSMS);
              this.byId("ipUpdtIdentification").setValue(oEntry.IdentificadorSMS);
              this.byId("idUpdtTitle").setValue(oEntry.TituloSMS);
              this.byId("idUpdtSSMText").setValue(oEntry.TextoSMS);

            }else{

              MessageBox.alert("Aconteceu algo inesperado");

            }

          }
          // pegar linha selecionada da tabela de mensagens
          // pegar propriedades title , text, id
          // montar post
          // pegar response

        },

        onDeleteSMS: async function (oEvent) {         
          //Delete Message
          let oSMS = this.getView().byId("idTableSMS").getSelectedItem();

          if ( oSMS === null ){
            MessageBox.alert("Selecione uma mensagem para deletar")
          }else{

            let oEntry = oSMS.getBindingContext().getObject();

            if ( oEntry.IdSMS !== null && oEntry.IdSMS !== undefined ) {
              // this.byId("ipUpdtSMS").setValue(oEntry.IdSMS);
              // this.byId("ipUpdtIdentification").setValue(oEntry.IdentificadorSMS);
              // this.byId("idUpdtTitle").setValue(oEntry.TituloSMS);
              // this.byId("idUpdtSSMText").setValue(oEntry.TextoSMS);
              MessageBox.alert("Delatado com sucesso!");
            }else{
              MessageBox.alert("Aconteceu algo inesperado");
            }
          }
        },

        onSaveSMSCreate: async function () {

          this.setAppBusy(true);

          let oIdentification = this.getView().byId("ipCreateIdentification").mProperties.value ;
          let oTitle = this.getView().byId("idCreateTitle").mProperties.value ;
          let oText = this.getView().byId("idCreateSSMText").mProperties.value ;
          
          this.byId("ipCreateIdentification").setEditable(false);
          this.byId("idCreateTitle").setEditable(false);
          this.byId("idCreateSSMText").setEditable(false);
          this.byId("btnSave").setEnabled(false);
          
          // console.log("Testando dados: ", oIdentification, oTitle, oText);
          
          let createPromisse = this._onPOST(oIdentification, oTitle, oText);
          
          let createdSMS ;
          
          await createPromisse
          .then(function (oData) {
            createdSMS  = oData;
            // console.log( "ID SMS Criado : ", createdSMS.IdSMS ) ;
            MessageBox.success(`SMS número: ${createdSMS.IdSMS} criado com Sucesso!`);
          })
          .catch(function (err) {
            // console.log("Erro criação: ", err);
            MessageBox.error('Aconteceu algo inesperado: ', err);
          });

          this.setAppBusy(false);

        },
          
        onSendSMSUpdate: async function () {

          this.setAppBusy(true);

          let oID = this.getView().byId("ipUpdtSMS").mProperties.value ;
          let oIdentification = this.getView().byId("ipUpdtIdentification").mProperties.value ;
          let oTitle = this.getView().byId("idUpdtTitle").mProperties.value ;
          let oText = this.getView().byId("idUpdtSSMText").mProperties.value ;
          
          // this.byId("ipUpdtSMS").setEditable(false);
          // this.byId("ipUpdtIdentification").setEditable(false);
          this.byId("idUpdtTitle").setEditable(false);
          this.byId("idUpdtSSMText").setEditable(false);
          this.byId("btnSaveUpdate").setEnabled(false);
          
          // console.log("Testando dados: ", oIdentification, oTitle, oText);
          
          let updatePromisse = this._onUPDATE(oID, oIdentification, oTitle, oText);
          
          let updateSMS ;
          
          await updatePromisse
          .then(function (oData) {
            updateSMS  = oData;
            // console.log( "ID SMS Criado : ", createdSMS.IdSMS ) ;
            MessageBox.success(`SMS número: ${updateSMS.IdSMS} atualizado com Sucesso!`);
          })
          .catch(function (err) {
            // console.log("Erro criação: ", err);
            MessageBox.error('Aconteceu algo inesperado: ', err);
          });

          this.setAppBusy(false);

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

        _onPOST: function(param1, param2, param3){

          let that = this ;
          let data = {
            IdentificadorSMS: param1,
            TituloSMS: param2,
            TextoSMS: param3
          }
          return new Promise(function (resolve, reject) {
            that.getModel().create("/ZFI_CDS_TEXTS_TO_SEND_SMS", data, {
              success: function (oData) {
                resolve(oData);
              },
              error: function (oError) {
                reject(oError);
              },
            });
          });
        },
        _onUPDATE: function(param1, param2, param3, param4){

          let that = this ;
          let data = {
            IdSMS: param1,
            IdentificadorSMS: param2,
            TituloSMS: param3,
            TextoSMS: param4
          }
          return new Promise(function (resolve, reject) {
            that.getModel().create("/ZFI_CDS_TEXTS_TO_SEND_SMS", data, {
              success: function (oData) {
                resolve(oData);
              },
              error: function (oError) {
                reject(oError);
              },
            });
          });
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
        _loadFragmentMessageSMSUpdate: async function () {

          if (!this._oDialogSMSUpdate) {
            this._oDialogSMSUpdate = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.UpdateMessage",
              controller: this,
            });
            await this._oDialogSMSUpdate
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogSMSUpdate = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogSMSUpdate.open();

        },
        _loadFragmentMessageSMSCreate: async function () {

          if (!this._oDialogSMSCreate) {
            this._oDialogSMSCreate = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.CreateMessage",
              controller: this,
            });

            await this._oDialogSMSCreate
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogSMSCreate = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogSMSCreate.open();

        },

        

      }
    );
  }
);
