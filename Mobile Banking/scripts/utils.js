(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};

    app.utils = {
        getMyLocation: function(options) {
			var dfd = new $.Deferred();

			//Default value for options
			if (options === undefined) {
				options = {enableHighAccuracy: true};
			}

			navigator.geolocation.getCurrentPosition(
				function(position) { 
					dfd.resolve(position);
				}, 
				function(error) {
					dfd.reject(error);
				}, 
				options);

			return dfd.promise();
		},
        errorHandler: function(errorCode) {
            var rcErrCat = Math.floor(errorCode / 100);
            
            if(rcErrCat === 11) {
                app.errorObj.errorStr = "There are <em>no transactions</em> for this account.";
            	app.errorObj.errorCancel = "Continue";
            }
            else if(rcErrCat === 12) {
            	if(errorCode === 1202) {
                    app.errorObj.errorStr = "There are <em>no transactions</em> for this account.";
                    app.errorObj.errorBack = "Re-enter Transfer";
                    app.errorObj.errorCancel = "Cancel";
                }
                else {
                    app.errorObj.errorStr = "This transaction is <em>not</em> allowed.";
                    app.errorObj.errorCancel = "Cancel";
                }
			}                    
            else if(rcErrCat === 13) {
                app.errorObj.errorStr = "Your transaction could <em>not</em> be completed.";
                app.errorObj.errorStr2 = "<i>Invalid amount.</i> ";
                app.errorObj.errorBack = "Re-enter Amount";
                app.errorObj.errorCancel = "Cancel";                
            }
            else if(rcErrCat === 14) {
            	if(errorCode === 1400) {
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>You have entered an invalid Card Number.</i>";
                    app.errorObj.errorStr3 = "Click on \"Login\" to re-enter your login information.";                   
                    app.errorObj.errorCancel = "Login";  
                }
                else if(errorCode === 1411) {
                    app.errorObj.errorStr = "You have <i>not</i> set up any bill vendors.";
                    app.errorObj.errorStr2 = "Navigate to <i>Edit Vendor List</i> to set up your vendors.";                 
                    app.errorObj.errorCancel = "Continue";  
				}
            	else if(errorCode > 1408 && errorCode < 1417) {
                    app.errorObj.errorStr = "You have <i>no</i> accounts which can be used for this transaction.";
                    app.errorObj.errorCancel = "Continue"; 
				}
            	else if(errorCode === 1417) {
                    app.errorObj.errorStr = "You have <i>not</i> set up any bill vendors.";
                    app.errorObj.errorCancel = "Continue"; 
				}
            	else {
                    app.errorObj.errorStr = "Your transaction could <em>not</em> be completed.";
                    app.errorObj.errorStr2 = "<i>Invalid amount.</i> ";
                    app.errorObj.errorCancel = "Continue";  
				}
            }
            else if(rcErrCat === 30) {
            	if(errorCode === 3007) {            
                    app.errorObj.errorStr = "Transaction attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "Click on \"Back\" to enter your Customer ID and password.";
                    app.errorObj.errorCancel = "Back";
                }
            	else if(errorCode === 3010) {            
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "Click on \"Login\" to re-enter your login information.";
                    app.errorObj.errorCancel = "Login";
                }
            	else if(errorCode === 3031) {            
                    app.errorObj.errorStr = "You have <i>not</i> made a valid choice.";
                    app.errorObj.errorStr2 = "Click on \"Continue\" to make a selection.";
                    app.errorObj.errorCancel = "Continue";
                }
            	else {            
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "Please contact your branch.";
                    app.errorObj.errorCancel = "Continue";
                }
            }
            else if(rcErrCat === 31) {
            	if(errorCode === 3100 || errorCode === 3101 || errorCode === 3102 || errorCode === 3105 || errorCode === 3111) {            
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>Invalid Password.</i>";
                    app.errorObj.errorStr3 = "Click on \"Login\" to re-enter your login information.";
                    app.errorObj.errorCancel = "Login";
                }
            	else if(errorCode === 3104) {
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>Your home banking account is not active. Please contact your branch</i>";
                    app.errorObj.errorStr3 = "Click on \"Login\" to try another account.";                   
                    app.errorObj.errorCancel = "Login";  
                }
            	else if(errorCode === 3106) {
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>You have exceeded the number of allowable password failures.</i>";
                    app.errorObj.errorStr3 = "Your Account has been <u>locked out</u>. <i>Please contact your branch</i>.";                   
                    app.errorObj.errorCancel = "Cancel";  
                }
            	if(errorCode === 3107 || errorCode === 3108 || errorCode === 3110) {            
                    app.errorObj.errorStr = "Your session has been <i>inactive</i> for too long.";
                    app.errorObj.errorStr2 = "Return to the Login form to re-enter your login information.";
                    app.errorObj.errorCancel = "Login";
                }                
            	else if(errorCode === 3109) {
                    app.errorObj.errorStr = "Login attempt <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>Password is too long.</i>";
                    app.errorObj.errorStr3 = "Click on \"Login\" to re-enter your login information.";                   
                    app.errorObj.errorCancel = "Login";  
                }
            	else if(errorCode === 3112) {
                    app.errorObj.errorStr = "Session error detected.";
                    app.errorObj.errorStr2 = "<i>Restart the app and login again.</i>";                 
                    app.errorObj.errorCancel = "Login";  
                }
            	else {
                    app.errorObj.errorStr = "<i>Sorry...</i><br>The server is unavailable at the moment.";
                    app.errorObj.errorStr2 = "Please try again later.";                 
                    app.errorObj.errorCancel = "Continue";  
                }
            }
            else if(rcErrCat === 51) {
                app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                app.errorObj.errorStr2 = "<i>Insufficient Funds.</i>";
                app.errorObj.errorBack = "Re-enter Transaction";
                app.errorObj.errorCancel = "Cancel";
            }
            else if(rcErrCat === 57) {
            	if(errorCode === 5702 || errorCode === 5703) {            
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "<i>Transaction date is too far in the future.</i>";
                    app.errorObj.errorBack = "Re-enter Transaction";
                    app.errorObj.errorCancel = "Cancel";
                }
            	else if(errorCode === 5704) {
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "<i>Bill Payments cannot be made unless your account address is complete.</i>";
                    app.errorObj.errorStr3 = "Please contact your branch to have your address updated.";                   
                    app.errorObj.errorCancel = "Continue";  
                }
            	else {
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "<i>Transaction is not allowed.</i>";                 
                    app.errorObj.errorCancel = "Continue";  
                }
			}
            else if(rcErrCat === 58) {
            	if(errorCode === 5802) {            
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "<i>You have tried to enter a utility bill with a blank name or account number.</i>";
                    app.errorObj.errorStr3 = "Select Back and re-enter incorrect values.";
                    app.errorObj.errorBack = "Back";
                    app.errorObj.errorCancel = "Cancel";
                }
            	if(errorCode === 5803) {            
                    app.errorObj.errorStr = "Your transaction could <i>not</i> be completed.";
                    app.errorObj.errorStr2 = "<i>Select Back and re-enter incorrect values.</i>";
                    app.errorObj.errorBack = "Back";
                    app.errorObj.errorCancel = "Cancel";
                }
            	if(errorCode === 5810) {            
                    app.errorObj.errorStr = "Password Change <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>Password is too long.</i>";
                    app.errorObj.errorStr3 = "Click on \"Back\" to re-enter your password information.";
                    app.errorObj.errorBack = "Back";
                }
            	if(errorCode === 5811) {            
                    app.errorObj.errorStr = "Password Change <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>Password was not verified properly.</i>";
                    app.errorObj.errorStr3 = "Click on \"Back\" to re-enter your password information.";
                    app.errorObj.errorBack = "Back";
                }
            	if(errorCode === 5812) {            
                    app.errorObj.errorStr = "Password Change <i>rejected</i>.";
                    app.errorObj.errorStr2 = "<i>New password must be different.</i>";
                    app.errorObj.errorStr3 = "Click on \"Back\" to re-enter your password information.";
                    app.errorObj.errorBack = "Back";
                }                
            	else {
                    app.errorObj.errorStr = "<i>Sorry...</i><br>The server is unavailable at the moment.";
                    app.errorObj.errorStr2 = "Please try again later.";                 
                    app.errorObj.errorCancel = "Continue";  
                }
            }
            else {
                app.errorObj.errorStr = "<i>Sorry...</i><br>The server is unavailable at the moment.";
                app.errorObj.errorStr2 = "Please try again later.";                 
                app.errorObj.errorCancel = "Continue";  
			}
            
        }
    };

})(window);