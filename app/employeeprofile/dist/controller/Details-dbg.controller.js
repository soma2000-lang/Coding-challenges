sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/constants"
    ],
   

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,constants) {
        "use strict";
        
        return Controller.extend("employeeprofile.controller.Details", {
            
            onInit: function () {
                this.oSFModel = this.getOwnerComponent().getModel();
                this.oModel = this.getOwnerComponent().getModel("ReportInfoModel");
              // this.initJsonModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatched, this);
            },
    
            _onObjectMatched: async function (oEvent) {
                this.fetchusersReport(oEvent).then((oData) => {
                    this.oModel.setProperty("/busy", false);
                }).catch((oErr) => {
                    this.oModel.setProperty("/busy", false);
                });
            },

            // initJsonModel: function () {
            //     this.oModel.setData(constants);
            // },

            
           
            fetchusersReport : async function (oEvent) {
                try {

                return new Promise(function (resolve, reject) {
                    var args = oEvent.getParameter("arguments");
                    console.log('arguments',args);
                    var userId=args.userId;
                    console.log("Please trigger:", userId);
                    this.oModel.setProperty("/busy", true);
                    this.oSFModel.setDeferredGroups(["batchfetchEmpDetails"]);
                    this.oSFModel.callFunction("/fetchEmpDetails", {
                        method: "GET",
                        batchGroupId: "batchfetchEmpDetails",
                        urlParameters: {
            
                            userId: userId
                           
                        }
                    });

                    // this.oSFModel.callFunction("/userjobinfo", {
                    //     method: "GET",
                    //     batchGroupId: "batchfetchEmpDetails",
                    //     urlParameters: {
                    //         userId: userId
                          
                    //     }
                    // });

                    // this.oSFModel.callFunction("/usersPhoto", {
                    //     method: "GET",
                    //     batchGroupId: "batchfetchEmpDetails",
                    //     urlParameters: {
                    //         userId: userId,
                           
                    //     }
                    // });
                    // this.oSFModel.callFunction("/compensationinfo", {
                    //     method: "GET",
                    //     batchGroupId: "batchfetchEmpDetails",
                    //     urlParameters: {
                    //         userId: userId,
                            
                    //     }
                    // });

                    

                    this.oSFModel.submitChanges({
                        batchGroupId: "batchfetchEmpDetails",
                        success: function (oData) {
                            var aUsers = [];
                            if (oData.__batchResponses[0].statusCode == '200') {
                                aUsers = oData.__batchResponses[0].data.results;
                            }

                           
                    
                            // if (oData.__batchResponses[1].statusCode == '200') {
                            //     aUsers = oData.__batchResponses[1].data.results;
                            
                            //     }
                            

                            //     if (oData.__batchResponses[2].statusCode == '200') {
                                                        
                            //                             aUsers=oData.__batchResponses[2].data.results;
                            //                             this.oModel.setProperty("/Users", aUsers);
                                                       
                            //                         }
                            // if (oData.__batchResponses[3].statusCode == '200') {
                            //     aUsers = oData.__batchResponses[3].data.results;
                
                        
                           //}
                        
                            console.log("aUsers",aUsers);
                            this.oModel.setProperty("/Users", aUsers);
                            
                                            resolve(true);
                                        }.bind(this),
                                        error: function (oError) {
                                            reject(oError);
                                        }.bind(this)
                                    });
                                }.bind(this));
            
                            } catch (oErr) {
                                reject(oErr);
                                this.oModel.setProperty("/busy", false);
                            }
                        }
            
            
            
            
                    });
                });