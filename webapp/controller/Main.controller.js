sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/Formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, Fragment, JSONModel, MessageBox, Formatter, Filter, FilterOperator) {
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
          // console.log("Begin was pressed");
        },

        onSendNewMessage: async function () {

          this.byId("btnSendNewMessage").setPressed(false);
          let oModel = this.getView().byId("smartTable").getTable().getSelectedItems();

          if (oModel.length != 0) {

            let hasDuplicateItems = false ;

            for (let line of oModel) {

              let oLine = line.getBindingContext().getObject();

              if ( oLine.DateToSendNextSMS !== '' & oLine.DateToSendNextSMS !== null && oLine.DateToSendNextSMS !== undefined ){
                hasDuplicateItems = true;
              }
            };

            if ( hasDuplicateItems === true ){
              MessageBox.warning("Selecione apenas partidas que não possuem envio de mensagem agendado");
            }else {
              await this._loadFragmentScheduleSMS();
            }

          } else {
            MessageBox.warning("Selecione pelo menos uma partida vencida para enviar SMS");
          }
        },

        onListMessages: async function () {
          this.byId("btnListMessages").setPressed(false);
          await this._loadFragmentMaintenenceSMS();
        },

        onSendSMSToSchedule: async function () {

          let oSMS = this.getView().byId("idTableSMSSchedule").getSelectedItem();

          if (oSMS === null) {
            MessageBox.alert("Selecione uma mensagem para enviar");

          } else {

            let oEntry = oSMS.getBindingContext().getObject();
            let oText = oEntry.TextoSMS;

            let oReSend = this.getView().byId("iptDaysResend").mProperties.value;
            if (oReSend === "") {
              oReSend = "00";
            }

            let oIdentification = this.getView().byId("iptVal").mProperties.value;

            if (oIdentification === "") {
              oIdentification = "EMPTY";
            }

            let oCheckBoxSchedule = this.getView().byId("RB1").getProperty("selected");
            let oScheduleDate = this.getView().byId("iptDate").mProperties.value;

            if (oCheckBoxSchedule === true) {
              
              if (oScheduleDate === "") {
                oScheduleDate = this._getCurrentDate( );
              }   

            } else {
              oScheduleDate = this._getCurrentDate( );
            }

            await this._loadFragmentMessageSMSReview();

            this.byId("ipReviewIdentification").setValue(oIdentification);
            this.byId("idReviewReSend" ).setValue(oReSend);
            this.byId("idReviewSMSText").setValue(oText);
            this.byId("idReviewDateToSend").setValue(oScheduleDate);
          }
          
        },

        // Leave send message page
        onExit: function (oEvent) {
          this._oDialog.close();
        },

        // Close main pop-up for SMS maintence view
        onExitSMSPopUp: function (oEvent) {
          this._oDialogM.close();
        },
        onExitSMSReview: function (oEvent) {
       
          let clear = "";
          this.byId("idReviewSMSText").setEditable(true);
          this.byId("btnReviewSave").setEnabled(true);
          
          this.byId("ipReviewIdentification").setValue(clear);
          this.byId("idReviewReSend" ).setValue(clear);
          this.byId("idReviewSMSText").setValue(clear);
          this.byId("idReviewDateToSend").setValue(clear);
          
          this._oDialogSMSReview.close();
        },

        // Leave update SMS pop-up
        onExitSMSUpdate: function (oEvent) {
          this._oDialogSMSUpdate.close();

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

          let clear = "";

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

          if (oSMS === null) {
            MessageBox.alert("Selecione uma mensagem para atualizar");
          } else {
            let oEntry = oSMS.getBindingContext().getObject();

            if (oEntry.IdSMS !== null && oEntry.IdSMS !== undefined) {
              await this._loadFragmentMessageSMSUpdate();
              this.byId("ipUpdtSMS").setValue(oEntry.IdSMS);
              this.byId("ipUpdtIdentification").setValue(
                oEntry.IdentificadorSMS
              );
              this.byId("idUpdtTitle").setValue(oEntry.TituloSMS);
              this.byId("idUpdtSSMText").setValue(oEntry.TextoSMS);
            } else {
              MessageBox.alert("Aconteceu algo inesperado");
            }
          }
        },

        onDeleteSMS: async function (oEvent) {
          //Delete Message
          let oSMS = this.getView().byId("idTableSMS").getSelectedItem();

          if (oSMS === null) {
            MessageBox.alert("Selecione uma mensagem para deletar");
          } else {
            let oEntry = oSMS.getBindingContext().getObject();

            if (
              oEntry.IdSMS !== null &&
              oEntry.IdSMS !== undefined &&
              oEntry.IdSMS !== ""
            ) {
              MessageBox.confirm(
                "Deseja Realmente deletar essa mensagem? Ela nao ficará mais dispoível para uso!",
                {
                  actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                  emphasizedAction: MessageBox.Action.OK,

                  onClose: async function (sAction) {
                    if (sAction == MessageBox.Action.OK) {
                      // MessageBox.alert("Delatado com sucesso!");
                      this.setAppBusy(true);
                      let oID = oEntry.IdSMS;
                      let deletePromisse = this._onDELETE(oID);
                      let deleteSMS;

                      await deletePromisse
                        .then(function (oData) {
                          deleteSMS = oData;
                          MessageBox.success(
                            `SMS número: ${deleteSMS.IdSMS} deletado com Sucesso!`
                          );
                        })
                        .catch(function (err) {
                          MessageBox.error("Aconteceu algo inesperado: ", err);
                        });

                      this.setAppBusy(false);
                    } else {
                      MessageBox.information("Deleção foi cancelada!");
                    }
                  }.bind(this),
                }
              );
            } else {
              MessageBox.alert("Aconteceu algo inesperado");
            }
          }
        },

        onSaveSMSCreate: async function () {
          this.setAppBusy(true);

          let oIdentification = this.getView().byId("ipCreateIdentification").mProperties.value;
          let oTitle = this.getView().byId("idCreateTitle").mProperties.value;
          let oText = this.getView().byId("idCreateSSMText").mProperties.value;

          this.byId("ipCreateIdentification").setEditable(false);
          this.byId("idCreateTitle").setEditable(false);
          this.byId("idCreateSSMText").setEditable(false);
          this.byId("btnSave").setEnabled(false);

          let createPromisse = this._onPOST(oIdentification, oTitle, oText);
          let createdSMS;

          await createPromisse
            .then(function (oData) {
              createdSMS = oData;
              // console.log( "ID SMS Criado : ", createdSMS.IdSMS ) ;
              MessageBox.success(
                `SMS número: ${createdSMS.IdSMS} criado com Sucesso!`
              );
            })
            .catch(function (err) {
              // console.log("Erro criação: ", err);
              MessageBox.error("Aconteceu algo inesperado: ", err);
            });

          this.setAppBusy(false);
        },

        onSendSMSUpdate: async function () {
          this.setAppBusy(true);

          let oID = this.getView().byId("ipUpdtSMS").mProperties.value;
          let oIdentification = this.getView().byId("ipUpdtIdentification").mProperties.value;
          let oTitle = this.getView().byId("idUpdtTitle").mProperties.value;
          let oText = this.getView().byId("idUpdtSSMText").mProperties.value;

          this.byId("idUpdtTitle").setEditable(false);
          this.byId("idUpdtSSMText").setEditable(false);
          this.byId("btnSaveUpdate").setEnabled(false);

          let updatePromisse = this._onUPDATE(
            oID,
            oIdentification,
            oTitle,
            oText
          );
          let updateSMS;

          await updatePromisse
            .then(function (oData) {
              updateSMS = oData;
              // console.log( "ID SMS Criado : ", createdSMS.IdSMS ) ;
              MessageBox.success(
                `SMS número: ${updateSMS.IdSMS} atualizado com Sucesso!`
              );
            })
            .catch(function (err) {
              // console.log("Erro criação: ", err);
              MessageBox.error("Aconteceu algo inesperado: ", err);
            });

          this.setAppBusy(false);
        },
        _onPOST: function (param1, param2, param3) {
          let that = this;
          let data = {
            IdentificadorSMS: param1,
            TituloSMS: param2,
            TextoSMS: param3,
          };
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
        _onDELETE: function (param1) {
          let that = this;
          let data = {
            IdSMS: param1,
            Deletado: true,
          };
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

        _onUPDATE: function (param1, param2, param3, param4) {
          let that = this;
          let data = {
            IdSMS: param1,
            IdentificadorSMS: param2,
            TituloSMS: param3,
            TextoSMS: param4,
          };
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

        _loadFragmentScheduleSMS: async function () {
          if (!this._oDialog) {
            this._oDialog = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.ScheduleSMSMessage",
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
        _loadFragmentMessageSMSReview: async function () {
          if (!this._oDialogSMSReview) {
            this._oDialogSMSReview = new Fragment.load({
              id: this.getView().getId(),
              name: "com.unimed.prestativ.zfisendbillingsms.view.fragments.ReviewDataFromScheduleSMS",
              controller: this,
            });

            await this._oDialogSMSReview
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogSMSReview = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogSMSReview.open();
        },

        _getCurrentDate: function () {
          return sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "dd/MM/yyyy",
            UTC: false,
          }).format(new Date());
        },

        onCreateScheduleSMS: function(oEvent) {

          MessageBox.confirm(
            "Deseja realmente agendar o envio de SMS de cobrança(s) ?",
            {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,

              onClose: async function (sAction) {
                if (sAction == MessageBox.Action.OK) { 
                  // MessageBox.information("Agendamento de envio de SMS realizado com sucesso!");

                  let oModel = this.getView().byId("smartTable").getTable().getSelectedItems();
                  let textLine = '';

                  let oIdentification = this.getView().byId("ipReviewIdentification" ).mProperties.value;
                  let oResend = this.getView().byId("idReviewReSend").mProperties.value;
                  let oDate = this.onDateStatement ( this.getView().byId("idReviewDateToSend").mProperties.value );
                  let oText = this.getView().byId("idReviewSMSText").mProperties.value;
                  
                  textLine += oIdentification  + ";;;;" +
                  oResend          + ";;;;" +
                              oDate            + ";;;;" +
                              oText            + "/*+*+*+*/";

                  for (let line of oModel) {

                    let oLine = line.getBindingContext().getObject();

                    let oCompany = oLine.Company;
                    let oCustomer = oLine.Customer;
                    let oDocument = oLine.Document ;
                    let oDocumentItem = oLine.DocumentItem ;
                    let oFiscalYear = oLine.FiscalYear ;

                    textLine += oCompany      + ";;;;" +
                                oCustomer     + ";;;;" +
                                oDocument     + ";;;;" +
                                oDocumentItem + ";;;;" +
                                oFiscalYear   + "::::" ;
                  };

                  // Send Schedule Messages
                  this.getModel().callFunction("/SendScheduleSMS", {
                      
                      urlParameters: {
                        SMSLines: textLine,
                      },
                      
                      success: function (oData) {
                        console.log(oData)
                        MessageBox.success('Envio de SMS agendado com sucesso');
                        this.setAppBusy(false);
                      }.bind(this),
                      
                      error: function (oError) {
                        console.log("When try to update custom table happened some error: ",  oError);
                        MessageBox.error('Falha ao tentar envio de SMS');
                        this.setAppBusy(false);
                      }.bind(this),
                      
                    } 
                    );
                    
                    this.byId("idReviewSMSText").setEditable(false);
                    this.byId("btnReviewSave").setEnabled(false);
                    
                  } else {
                    MessageBox.information("Envio cancelado");
                  }
                  
                }.bind(this),
                
              } 
              );
            },
            onDateStatement: function (oDate) {
              let [day, month, year] = oDate.split("/");
              let formatedDate = year + month + day;
              return formatedDate;
            },
            
            _onSearch: function(oEvent) {

              let sValue  = oEvent.getParameter("query");
              let oTable = this.byId("idTableSMSSchedule");

              let oFilter = new Filter({
                filters: [
                  new Filter("IdSMS", FilterOperator.Contains, sValue),
                  new Filter("IdentificadorSMS", FilterOperator.Contains, sValue),
                  new Filter("TituloSMS", FilterOperator.Contains, sValue),
                  new Filter("TextoSMS", FilterOperator.Contains, sValue)
                ],
                and: false 
              }); 
              
              oTable.getBinding("items").filter([oFilter]);
            
            },

          }
          );
        }
        );
        