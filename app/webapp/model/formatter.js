sap.ui.define([], function () {
	"use strict";
	return {
		
		formatTimestamp: function (timestamp) {
			if (timestamp) {
				return moment(timestamp).format("DD.MM.YYYY HH:mm:ss");
			}
			return "";
		}

	};
});