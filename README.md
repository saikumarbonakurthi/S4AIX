{
	"_version": "1.8.0",
	"sap.app": {
		"id": "LineItemSuperQuery",
		"type": "application",
		"i18n": "i18n/i18n.properties",
		"applicationVersion": {
			"version": "1.0.0"
		},
		"title": "{{appTitle}}",
		"description": "{{appDescription}}",
		"tags": {
			"keywords": []
		},
		"dataSources": {
			"mainService": {
				"uri": "/sap/opu/odata/sap/ZGWP_INV_LINE_ITEM_SQ_SRV/",
				"type": "OData",
				"settings": {
					"localUri": "localService/metadata.xml",
					"annotations": [
						"annotation0"
					]
				}
			},
			"annotation0": {
				"type": "ODataAnnotation",
				"uri": "annotation0.xml",
				"settings": {
					"localUri": "annotation0.xml"
				}
			},
			"ZAP_PROFITCENTER_HIERARCHY_SRV": {
				"uri": "/sap/opu/odata/sap/ZAP_PROFITCENTER_HIERARCHY_SRV/",
				"type": "OData",
				"settings": {
					"localUri": "localService/ZAP_PROFITCENTER_HIERARCHY_SRV/metadata.xml"
				}
			}
		},
		"offline": false,
		"sourceTemplate": {
			"id": "servicecatalog.connectivityComponentForManifest",
			"version": "0.0.0"
		}
	},
	"sap.ui": {
		"technology": "UI5",
		"icons": {
			"icon": "",
			"favIcon": "",
			"phone": "",
			"phone@2": "",
			"tablet": "",
			"tablet@2": ""
		},
		"deviceTypes": {
			"desktop": true,
			"tablet": true,
			"phone": true
		},
		"supportedThemes": [
			"sap_fiori_3"
		]
	},
	"sap.ui5": {
		"resources": {
			"js": [],
			"css": []
		},
		"dependencies": {
			"minUI5Version": "1.65.6",
			"libs": {},
			"components": {}
		},
		"models": {
			"i18n": {
				"type": "sap.ui.model.resource.ResourceModel",
				"uri": "i18n/i18n.properties"
			},
			"@i18n": {
				"type": "sap.ui.model.resource.ResourceModel",
				"uri": "i18n/i18n.properties"
			},
			"i18n|sap.suite.ui.generic.template.ListReport|ETY_INVSQ_RESULTSet": {
				"type": "sap.ui.model.resource.ResourceModel",
				"uri": "i18n/ListReport/ETY_INVSQ_RESULTSet/i18n.properties"
			},
			"i18n|sap.suite.ui.generic.template.ObjectPage|ETY_INVSQ_RESULTSet": {
				"type": "sap.ui.model.resource.ResourceModel",
				"uri": "i18n/ObjectPage/ETY_INVSQ_RESULTSet/i18n.properties"
			},
			"": {
				"dataSource": "mainService",
				"preload": true,
				"settings": {
					"defaultBindingMode": "TwoWay",
					"defaultCountMode": "Inline",
					"refreshAfterChange": false,
					"metadataUrlParams": {
						"sap-value-list": "none"
					}
				}
			},
			"treeData": {
				"type": "sap.ui.model.odata.v2.ODataModel",
				"settings": {
					"defaultOperationMode": "Server",
					"defaultBindingMode": "OneWay",
					"defaultCountMode": "Request"
				},
				"dataSource": "ZAP_PROFITCENTER_HIERARCHY_SRV",
				"preload": true
			}
		},
		"extends": {
			"extensions": {
				"sap.ui.viewExtensions": {
					"sap.suite.ui.generic.template.ListReport.view.ListReport": {
						"SmartFilterBarControlConfigurationExtension|ETY_INVSQ_RESULTSet": {
							"className": "sap.ui.core.Fragment",
							"fragmentName": "LineItemSuperQuery.ext.fragment.Customfilter",
							"type": "XML"
						}
					}
				},
				"sap.ui.controllerExtensions": {
					"sap.suite.ui.generic.template.ListReport.view.ListReport": {
						"controllerName": "LineItemSuperQuery.ext.controller.ListReportExt",
						"sap.ui.generic.app":{
							"ListReport|ETY_INVSQ_RESULTSet": {
							"EntitySet":"ETY_INVSQ_RESULTSet",
							"Actions":{
								"ExportPDF": {
									"id": "btnExportPDF",
									"text": "Export to PDF",
									"press": "onExportPDF",
									"requiresSelection": false
								}
							}
						}
					}
				}
			},
		"contentDensities": {
			"compact": true,
			"cozy": true
		}
	},
	"sap.ui.generic.app": {
		"_version": "1.3.0",
		"settings": {
			"forceGlobalRefresh": false,
			"objectPageHeaderType": "Dynamic",
			"showDraftToggle": false
		},
		"pages": {
			"ListReport|ETY_INVSQ_RESULTSet": {
				"entitySet": "ETY_INVSQ_RESULTSet",
				"component": {
					"name": "sap.suite.ui.generic.template.ListReport",
					"list": true,
					"settings": {
						"variantManagementHidden": false,
						"gridTable": true,
						"useExportToExcel": true
					}
				}
			}
		}
	},
	"sap.platform.hcp": {
		"uri": "",
		"_version": "1.1.0"
	},
	"sap.platform.abap": {
		"uri": "/sap/bc/ui5_ui5/sap/zinvlinesq",
		"_version": "1.1.0"
	}
}# S4AIX
