sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function(Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			var dataModel = new JSONModel({
				selectedYear: parseInt(moment().format("YYYY"))		// current year
			});
			this.getView().setModel(dataModel, "data");

			dataModel.attachRequestCompleted(this.updateChartData, this);
			dataModel.loadData("/getData");

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		updateChartData: function () {
			var dataModel = this.getView().getModel("data");
			var data = dataModel.getProperty("/data");
			var selectedYear = dataModel.getProperty("/selectedYear");
			if (selectedYear === null || selectedYear === undefined) {
				selectedYear = parseInt(moment().format("YYYY"));
				dataModel.setProperty("/selectedYear", selectedYear);
			}
			var minX = moment(selectedYear + "-01-01 00:00:00");
			var maxX = moment((selectedYear + 1) + "-01-01 00:00:00");

			var dataset =  {
				data: [],
				borderColor: "#3e95cd",
				fill: false,
				label: "Messdaten " + selectedYear
			};
			for (var i = 0; i < data.length; i++) {
				var timestamp = moment(data[i].timestamp);

				dataset.data.push({
					x: timestamp,
					y: data[i].volume
				});
			}

			dataModel.setProperty("/datasets", [dataset]);

			var chart = this.getView().byId("lineChart");
			chart.setScales({
				xAxes: [{
					type: "time",
					time: {
						unit: "month",
						displayFormats: {
							month: "DD. MMM YY",
							quarter: "MMM YY"
						},
						min: minX,
                		max: maxX
					}
				}],
				yAxes: [{
					ticks: {
						min: 0,
						max: 10000,
						stepSize: 1000
					}
				}]
			});
		},

		onAnimationComplete: function () {
			var chart = this.getView().byId("lineChart");
			var ctx = chart.__ctx.getContext("2d");

			ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            chart.__chart.data.datasets.forEach(function (dataset, i) {
                var meta = chart.__chart.getDatasetMeta(i);
                meta.data.forEach(function (bar, index) {
					var data = dataset.data[index];
					data = data.y || data;
					
					ctx.fillStyle = '#000000';
                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                });
            });
		},

		groupByYear: function (context) {
			var year = moment(context.getProperty("timestamp")).year();

			return {
				key: year,
				text: year
			};
		},

		downloadCsv: function () {
			var link = document.createElement("a");
			link.download = "Messdaten.csv";
			link.href = "/downloadData";
			link.click();
		}

	});
});