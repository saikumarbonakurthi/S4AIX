sap.ui.controller("LineItemSuperQuery.ext.controller.ListReportExt", {
	gv_tokens: "",
	newVariant_data: "",
	result: "",
	resultHier: "",
	rowindex: "",
	handleValueHelpPC: function (e) {
		var that = this;

		var aFirstTokens = this.byId("pcInputGLV").getTokens();
		var aFirstData = [];
		if (aFirstTokens.length !== 0) {
			for (var i = 0; i < aFirstTokens.length; i++) {
				aFirstData.push(aFirstTokens[i].getText());
			}
		}
		if (aFirstData.includes("CVS_PCH")) {
			var firstindex = this.getView().byId("table");
			setTimeout(function () {
				firstindex.addSelectionInterval(0, 0);
			});
		}

		if (!this.oTreeDialog) {
			this.oTreeDialog = sap.ui.xmlfragment(this.getView().getId(), "LineItemSuperQuery.view.tree", this);
			this.getView().addDependent(this.oTreeDialog);
			var t = this.getView().byId("table");
			t.bindRows({
				path: "treeData>/PcHierarchySet",
				parameters: {
					expand: "PcHierarchySet",
					navigation: {
						PcHierarchySet: "PcHierarchySet"
					}
				},
				events: {
					dataReceived: function (q) {
						var data = q.getParameter("data"),
							table = this.byId("table"),
							length = data.results.length,
							aTokens = this.byId("pcInputGLV").getTokens(),
							aData = [];

						if (aTokens.length !== 0) {
							for (var i = 0; i < aTokens.length; i++) {
								aData.push(aTokens[i].getText());
							}
						}

						if (aData.includes("CVS_PCH")) {
							setTimeout(function () {
								table.addSelectionInterval(0, 0);
							});
						}

						if (length) {
							data.results.forEach(function (e, index) {
								if (aData.includes(e.Parent)) {
									var childIndex = this.currentIndex + index + 1;
									setTimeout(function () {
										table.addSelectionInterval(childIndex, childIndex);
									});
								}
							}.bind(this));
						}
					}.bind(this)
				}
			});
		}
		this.oTreeDialog.open();
	},

	ontoggleOpenState: function (e) {

		var table = e.getSource(),
			aTokens = this.byId("pcInputGLV").getTokens(),
			aData = [],
			oParameters = e.getParameters();

		if (aTokens.length !== 0) {
			for (var q = 0; q < aTokens.length; q++) {
				aData.push(aTokens[q].getText());
			}
		}

		if (oParameters.expanded && aTokens.length !== 0) {
			this.byId("vendorValueHelp").setBusy(true);
			this.currentIndex = oParameters.rowIndex;
			var sNodePath = table.getContextByIndex(this.currentIndex).getObject().Parent;
			this.getView().getModel("treeData").read("/PcHierarchySet('" + sNodePath + "')", {
				success: function (oData, oResponse) {
					this.byId("vendorValueHelp").setBusy(false);
					var iCount = +oData.Parent;
					for (var i = this.currentIndex + 1; i < this.currentIndex + iCount + 1; i++) {
						if (table.getContextByIndex(i) && aData.includes(table.getContextByIndex(i).getObject().Parent)) {
							table.addSelectionInterval(i, i);
						}
					}
				}.bind(this),
				error: function (oError) {}
			});
		}

	},
	onTreeOk: function (e) {
		var t = this.byId("table").getSelectedIndices(),
			r = this.getView().byId("table"),
			a = this.getView().byId("pcInputGLV"),
			i = [];
		t.forEach(function (e) {
			var t = r.getContextByIndex(e),
				a = t.getObject();
			i.push(new sap.m.Token({
				key: a.Parent,
				text: a.Parent
			}));
		});
		a.setTokens(i);
		if (i.length > 0) {
			a.setValue(" ");
		}
		if (i.length === 0) {
			// a.setValue;
		}
		this.gv_tokens = a.getTokens();
		var len = this.byId("pcInputGLV").getTokens().length;
		if (len) {
			this.byId("pcInputGLV").setValueState("None");
		}
		//defect # 6994: Error in Invoice Line-Item Super Query- Fiori - code changes done by C1286803
			//added try and catch logic (the user was unable to select the profit center hierarchy node value from hthe list upon "ok")
		try {
			var aLifnr = this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").getTokens();
			aLifnr.push(new sap.m.Token({
				key: "Test",
				text: "Test"
			}));
			this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").setTokens(aLifnr);
			var aLifnrNew = this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").getTokens();
			aLifnrNew.pop();
			this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").setTokens(aLifnrNew);
		} catch (e) {
			
		}
		//defect # 6994: Error in Invoice Line-Item Super Query- Fiori - code changes done by C1286803 
		this.oTreeDialog.close();
	},
	onTreeCancel: function (e) {
		this.oTreeDialog.close();
	},

	onBeforeRebindTableExtension: function (e) {
		var t = e.getSource();
		var r = e.getParameter("bindingParams");
		r.parameters = r.parameters || {};
		var a = this.byId(t.getSmartFilterId());
		if (a instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			var i = this.byId("pcInputGLV").getTokens();
			if (i.length) {
				for (var n = 0; n < i.length; n++) {
					var o = this.byId("pcInputGLV").getTokens()[n].getKey();
					if (o === "") {
						o = this.byId("pcInputGLV").getTokens()[n].getText();
					}
					r.filters.push(new sap.ui.model.Filter("Pchier", "EQ", o));
				}
			}
		}
	},

	getCustomAppStateDataExtension: function (oCustomData) {

		var aPCHier = [];
		var tokens = this.byId("pcInputGLV").getTokens();
		if (tokens) {
			for (var i = 0; i < tokens.length; i++) {
				aPCHier.push(tokens[i].getText());
			}
			if (aPCHier.length !== 0) {
				while (aPCHier.length !== 50) {
					aPCHier.push(tokens[0].getText());
				}
			}
			oCustomData.PCHier = aPCHier;
		}
		return oCustomData;
	},

	restoreCustomAppStateDataExtension: function (oCustomData) {

		// if (this.getView().byId("listReportFilter").getVariantManagement().lastSelectedVariantKey === "*standard*") {
		// 	var oTodayHigh = new Date();
		// 	var oTodayLow = new Date();

		// 	oTodayLow.setDate(oTodayHigh.getDate() - 365);
		// 	var oDefaultFilter = {
		// 		Budat: {
		// 			low: oTodayLow,
		// 			high: oTodayHigh
		// 		}
		// 	};
		// 	this.getView().byId("listReportFilter").setFilterData(oDefaultFilter);
		// }

		if (this.getView().byId("table")) {
			this.getView().byId("table").collapseAll();
			this.getView().byId("table").removeSelectionInterval(0, 0);
		}

		var names = oCustomData.PCHier;
		var uniqueNames = [];
		$.each(names, function (i, el) {
			if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		oCustomData.PCHier = uniqueNames;

		if (oCustomData.PCHier.length !== 0) {
			this.getView().byId("pcInputGLV").removeAllTokens();
			var len = oCustomData.PCHier.length;
			if (len) {
				for (var i = 0; i < len; i++) {
					var defToken = new sap.m.Token({
						text: oCustomData.PCHier[i]
					});
					this.getView().byId("pcInputGLV").addToken(defToken);
				}
				this.newVariant_data = this.byId("pcInputGLV").getTokens();
				this.getView().byId("pcInputGLV").setValue(" ");
			}
		} else {
			this.getView().byId("pcInputGLV").removeAllTokens();
		}
	},

	ontokenUpdate: function () {

		var len = this.byId("pcInputGLV").getTokens().length;
		if (len === 0) {
			this.getView().byId("pcInputGLV").setValue("");
			this.byId("pcInputGLV").setValueState("Error");
		} else {
			this.byId("pcInputGLV").setValueState("None");
		}
		//defect # 6994: Error in Invoice Line-Item Super Query- Fiori - code changes done by C1286803 
				//added try and catch logic (the user was unable to select the profit center hierarchy node value from hthe list upon "ok")
		try {
			var aLifnr = this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").getTokens();
			aLifnr.push(new sap.m.Token({
				key: "Test",
				text: "Test"
			}));
			this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").setTokens(aLifnr);
			var aLifnrNew = this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").getTokens();
			aLifnrNew.pop();
			this.byId("listReportFilter-filterItemControl___INTERNAL_-ProjectId").setTokens(aLifnrNew);

			// listReportFilter-filterItemControl___INTERNAL_-ProjectId
		} catch (e) {
		
		}
		//defect # 6994: Error in Invoice Line-Item Super Query- Fiori - code changes done by C1286803 
	},

	provideCustomStateExtension: function (oState) {

	},

	applyCustomStateExtension: function (oState, bIsSameAsLast) {

	},

	onBeforeRendering: function () {
		var oGlobalFilter = this.getView().byId("listReportFilter");

		var sDefaultVariantKey = oGlobalFilter.getVariantManagement().getDefaultVariantKey();

		if (sDefaultVariantKey !== "*standard*") {
			return;
		}

		var oTodayHigh = new Date();
		var oTodayLow = new Date();

		oTodayLow.setDate(oTodayHigh.getDate() - 365);
		var oDefaultFilter = {
			Budat: {
				low: oTodayLow,
				high: oTodayHigh
			}
		};

		oGlobalFilter.setFilterData(oDefaultFilter);
	},

	// ============================================================================
	// PDF EXPORT  (added: behaves like Export to Excel — full filtered set, client-side)
	// ============================================================================
	onExportPDF: function () {
		var oView = this.getView();
		var oSFB = oView.byId("listReportFilter");
		var oModel = oView.getModel();
		var that = this;

		// standard SmartFilterBar filters (Budat range etc. included automatically)
		var aFilters = oSFB.getFilters();

		// replay the custom Pchier tokens EXACTLY as onBeforeRebindTableExtension does,
		// so the PDF data set matches the table data set
		this.byId("pcInputGLV").getTokens().forEach(function (oTok) {
			aFilters.push(new sap.ui.model.Filter("Pchier", "EQ", oTok.getKey() || oTok.getText()));
		});

		oView.setBusy(true);

		// cheap COUNT first — decide before pulling rows into the browser
		oModel.read("/ETY_INVSQ_RESULTSet/$count", {
			filters: aFilters,
			success: function (iCount) {
				var n = parseInt(iCount, 10);

				if (!n) {
					oView.setBusy(false);
					sap.m.MessageToast.show("No data to export.");
					return;
				}

				// THRESHOLD — typical export is ~5K (fine). Block the rare large set.
				if (n > 10000) {
					oView.setBusy(false);
					sap.m.MessageBox.warning(
						n + " rows is too many for a readable PDF (~" + Math.ceil(n / 40) +
						" pages). Narrow your filters, or use Export to Excel for the full set."
					);
					return;
				}

				// under threshold — read the full filtered set and render
				oModel.read("/ETY_INVSQ_RESULTSet", {
					filters: aFilters,
					urlParameters: {
						"$top": String(n)
					},
					success: function (oData) {
						oView.setBusy(false);
						that._buildPDF(oData.results || []);
					},
					error: function () {
						oView.setBusy(false);
						sap.m.MessageToast.show("PDF read failed.");
					}
				});
			},
			error: function () {
				oView.setBusy(false);
				sap.m.MessageToast.show("Could not determine record count.");
			}
		});
	},

	_buildPDF: function (aRows) {
		// format amounts so the PDF matches the on-screen / Excel values (e.g. -2.774,00)
		var oAmtFmt = sap.ui.core.format.NumberFormat.getFloatInstance({
			groupingEnabled: true,
			decimals: 2
		});

		aRows = aRows.map(function (row) {
			var r = Object.assign({}, row);
			// >>> repeat per amount field that exists in your $metadata <<<
			if (r.Dmbtr !== undefined && r.Dmbtr !== null) {
				r.Dmbtr = oAmtFmt.format(parseFloat(r.Dmbtr));
			}
			return r;
		});

		var doc = new window.jspdf.jsPDF("l", "pt", "a4"); // landscape

		// >>> REPLACE dataKey values with the REAL property names from $metadata <<<
		// (open /sap/opu/odata/sap/ZGWP_INV_LINE_ITEM_SQ_SRV/$metadata, EntityType ETY_INVSQ_RESULT)
		var aColumns = [
			{ header: "Company Code", dataKey: "Bukrs" },
			{ header: "Document No", dataKey: "Belnr" },
			{ header: "Period", dataKey: "Period" },
			{ header: "Amount", dataKey: "Dmbtr" }
			// ...add your 5–7 chosen columns...
		];

		doc.autoTable({
			columns: aColumns,
			body: aRows,
			styles: {
				fontSize: 7
			},
			margin: {
				top: 30
			}
		});

		doc.save("LineItems.pdf");
	}

});
