(function (global) {
    var ErrorViewModel,
        app = global.app = global.app || {};

    ErrorViewModel = kendo.data.ObservableObject.extend({
        errorCode: 0, 
        errorStr: "", 
        errorStr2: "", 
        errorStr3: "", 
        errorStr4: "",
        errorCancel: "", 
        errorBack: "",
        errorFrom: "",

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
        },
        setError: function(errorCodeStr, errorFrom, errorDetail) {
            var that = this;
            var errorCode = parseInt(errorCodeStr);
            var rcErrCat = Math.floor(errorCode / 100);
            
            that.set("errorCode", errorCode);
            that.set("errorStr4", "error code: " + errorCode);
            that.set("errorFrom", errorFrom);
            
            //clear error info
            that.set("errorStr", "");
            that.set("errorStr2", "");
            that.set("errorStr3", "");                   
            that.set("errorCancel", ""); 
            that.set("errorBack", ""); 
            
            if(rcErrCat < 10) {
                that.set("errorStr", "<em>- ALERT -</em>");
                that.set("errorStr2", errorDetail);
                that.set("errorCancel", "Continue");
            }
            else if(rcErrCat === 10) {
                that.set("errorStr", "There are <em>errors</em> on this form.");
                that.set("errorStr2", errorDetail);
                that.set("errorCancel", "Continue");
            }
            
            else if(rcErrCat === 11) {
                that.set("errorStr", "There are <em>no transactions</em> for this account.");
            	that.set("errorCancel", "Continue");
            }
            else if(rcErrCat === 12) {
            	if(errorCode === 1202) {
                    that.set("errorStr", "<em>Cannot</em> transfer to the same account.");
                    that.set("errorBack", "Re-enter Transfer");
                    that.set("errorCancel", "Cancel");
                }
                else {
                    that.set("errorStr", "This transaction is <em>not</em> allowed.");
                    that.set("errorCancel", "Cancel");
                }
			}                    
            else if(rcErrCat === 13) {
                that.set("errorStr", "Your transaction could <em>not</em> be completed.");
                that.set("errorStr2", "<i>Invalid amount.</i> ");
                that.set("errorBack", "Re-enter Amount");
                that.set("errorCancel", "Cancel");                
            }
            else if(rcErrCat === 14) {
            	if(errorCode === 1400) {
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>You have entered an invalid Card Number.</i>");
                    that.set("errorStr3", "Click on \"Login\" to re-enter your login information.");                   
                    that.set("errorCancel", "Login");  
                }
                else if(errorCode === 1401) {
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>You have to entered a Card Number and password.</i>");
                    that.set("errorStr3", "Click on \"Login\" to re-enter your login information.");                   
                    that.set("errorCancel", "Login");  
                }
                else if(errorCode === 1402) {
                    that.set("errorStr", "You have <i>not</i> set up any bill vendors.");
                    that.set("errorStr2", "Navigate to <i>Edit Vendor List</i> to set up your vendors.");                 
                    that.set("errorCancel", "Continue");  
				}
                else if(errorCode === 1411) {
                    that.set("errorStr", "You have <i>not</i> set up any bill vendors.");
                    that.set("errorStr2", "Navigate to <i>Edit Vendor List</i> to set up your vendors.");                 
                    that.set("errorCancel", "Continue");  
				}
            	else if(errorCode > 1408 && errorCode < 1417) {
                    that.set("errorStr", "You have <i>no</i> accounts which can be used for this transaction.");
                    that.set("errorCancel", "Continue"); 
				}
            	else if(errorCode === 1417) {
                    that.set("errorStr", "You have <i>not</i> set up any bill vendors.");
                    that.set("errorCancel", "Continue"); 
				}
            	else {
                    that.set("errorStr", "Your transaction could <em>not</em> be completed.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Invalid amount.</i> ");
                    that.set("errorCancel", "Continue");  
				}
            }
            else if(rcErrCat === 30) {
            	if(errorCode === 3007) {            
                    that.set("errorStr", "Transaction attempt <i>rejected</i>.");
                    that.set("errorStr2", "Click on \"Back\" to enter your Customer ID and password.");
                    that.set("errorCancel", "Back");
                }
            	else if(errorCode === 3010) {            
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "Click on \"Login\" to re-enter your login information.");
                    that.set("errorCancel", "Login");
                }
            	else if(errorCode === 3031) {            
                    that.set("errorStr", "You have <i>not</i> made a valid choice.");
                    that.set("errorStr2", "Click on \"Continue\" to make a selection.");
                    that.set("errorCancel", "Continue");
                }
            	else {            
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "Please contact your branch.");
                    that.set("errorCancel", "Continue");
                }
            }
            else if(rcErrCat === 31) {
            	if(errorCode === 3100 || errorCode === 3101 || errorCode === 3102 || errorCode === 3105 || errorCode === 3111) {            
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Invalid Password.</i>");
                    that.set("errorStr3", "Click on \"Login\" to re-enter your login information.");
                    that.set("errorCancel", "Login");
                }
            	else if(errorCode === 3104) {
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Your home banking account is not active. Please contact your branch</i>");
                    that.set("errorStr3", "Click on \"Login\" to try another account.");                   
                    that.set("errorCancel", "Login");  
                }
            	else if(errorCode === 3106) {
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i>You have exceeded the number of allowable password failures.</i>");
                    that.set("errorStr3", "Your Account has been <u>locked out</u>. <i>Please contact your branch</i>.");                   
                    that.set("errorCancel", "Cancel");  
                }
            	else if(errorCode === 3107 || errorCode === 3108 || errorCode === 3110) {            
                    that.set("errorStr", "Your session has been <i>inactive</i> for too long.");
                    that.set("errorStr2", "Return to the Login form to re-enter your login information.");
                    that.set("errorCancel", "Login");
                }                
            	else if(errorCode === 3109) {
                    that.set("errorStr", "Login attempt <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Password is too long.</i>");
                    that.set("errorStr3", "Click on \"Login\" to re-enter your login information.");                   
                    that.set("errorCancel", "Login");  
                }
            	else if(errorCode === 3112) {
                    that.set("errorStr", "Session error detected.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Restart the app and login again.</i>");                 
                    that.set("errorCancel", "Login");  
                }
            	else if(errorCode === 3113) {
                    that.set("errorStr", "Outdated app detected.");
                    that.set("errorStr2", "<i style='color:#CC9900'>This version is no longer supported.</i>");        
                    that.set("errorStr3", "Please update your app or <i>contact your branch</i>.<br />");
                    that.set("errorCancel", "Cancel");  
                }
                else {
                    that.set("errorStr", "<i>Sorry...</i><br>The server is unavailable at the moment.");
                    that.set("errorStr2", "Please try again later.");                 
                    that.set("errorCancel", "Continue");  
                }
            }
            else if(rcErrCat === 51) {
                that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                that.set("errorStr2", "<i style='color:#CC9900'>Insufficient Funds.</i>");
                that.set("errorBack", "Re-enter Transaction");
                that.set("errorCancel", "Cancel");
            }
            else if(rcErrCat === 57) {
            	if(errorCode === 5702 || errorCode === 5703) {            
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Transaction date is too far in the future.</i>");
                    that.set("errorBack", "Re-enter Transaction");
                    that.set("errorCancel", "Cancel");
                }
            	else if(errorCode === 5704) {
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Bill Payments cannot be made unless your account address is complete.</i>");
                    that.set("errorStr3", "Please contact your branch to have your address updated.");                   
                    that.set("errorCancel", "Continue");  
                }
            	else {
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "<i>Transaction is not allowed.</i>");                 
                    that.set("errorCancel", "Continue");  
                }
			}
            else if(rcErrCat === 58) {
            	if(errorCode === 5802) {            
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "<i style='color:#CC9900'>You have tried to enter a utility bill with a blank name or account number.</i>");
                    that.set("errorStr3", "Select Back and re-enter incorrect values.");
                    that.set("errorBack", "Back");
                    that.set("errorCancel", "Cancel");
                }
            	else if(errorCode === 5803) {            
                    that.set("errorStr", "Your transaction could <i>not</i> be completed.");
                    that.set("errorStr2", "<i>Select Back and re-enter incorrect values.</i>");
                    that.set("errorBack", "Back");
                    that.set("errorCancel", "Cancel");
                }
            	else if(errorCode === 5810) {            
                    that.set("errorStr", "Password Change <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Password is too long.</i>");
                    that.set("errorStr3", "Click on \"Back\" to re-enter your password information.");
                    that.set("errorBack", "Back");
                }
            	else if(errorCode === 5811) {            
                    that.set("errorStr", "Password Change <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>Password was not verified properly.</i>");
                    that.set("errorStr3", "Click on \"Back\" to re-enter your password information.");
                    that.set("errorBack", "Back");
                }
            	else if(errorCode === 5812) {            
                    that.set("errorStr", "Password Change <i>rejected</i>.");
                    that.set("errorStr2", "<i style='color:#CC9900'>New password must be different.</i>");
                    that.set("errorStr3", "Click on \"Back\" to re-enter your password information.");
                    that.set("errorBack", "Back");
                }                
            	else {
                    that.set("errorStr", "<i>Sorry...</i><br>The server is unavailable at the moment.");
                    that.set("errorStr2", "Please try again later.");                 
                    that.set("errorCancel", "Continue");  
                }
            }
            else {
                that.set("errorStr", "<i>Sorry...</i><br>The server is unavailable at the moment.");
                that.set("errorStr2", "Please try again later.");                 
                that.set("errorCancel", "Continue");  
			}
            
        },
        showCancel: function() {
            if (errorCancel.length > 0) {
                return true;
            }
            return false;
        },
        clickCancel: function() {
            // Close the form and navigate to main page
            console.log("clickConsole");
            $("#modalview-error").kendoMobileModalView("close");   
            app.application.navigate("#tabstrip-login");
        },
        showBack: function() {
            if (errorBack.length > 0) {
                return true;
            }
            return false;
        },
        clickBack: function() {
            //simply Close the from
            console.log("clickBack");
            //app.application.navigate("#:back");
            $("#modalview-error").kendoMobileModalView("close");
        }

    });
    
    app.errorService = {
        viewModel: new ErrorViewModel()
    };
    
    
    
})(window); 