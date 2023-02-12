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


  };
});
