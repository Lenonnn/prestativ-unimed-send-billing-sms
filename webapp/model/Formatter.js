sap.ui.define([], function () {
  "use strict";

  return {
    formatStatusIcon: function (StatusText) {
      switch (StatusText) {
        case "Vencida":
          return "sap-icon://time-overtime";
        case "A Vencer":
          return "";
        default:
          return "";
      }
    },
    formatStatusIconSend: function (StatusText) {
      switch (StatusText) {
        case "Enviado":
          return "sap-icon://message-success";
        case "Erro no envio":
          return "sap-icon://message-error";
        default:
          return "";
      }
    },
    formatDate: function(oDate){

      if( oDate !== null && oDate !== '' && oDate !== undefined ){
        return sap.ui.core.format.DateFormat.getDateTimeInstance({
          pattern: "dd/MM/yyyy",
          UTC: true,
        }).format(oDate);

      }else{
        return '';
      }
      
    },

  };
});
