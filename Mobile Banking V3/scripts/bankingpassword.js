(function(global) {  
    var BankingPasswordViewModel,
        app = global.app = global.app || {};
    
    BankingPasswordViewModel = kendo.observable({      
        passwordInfo: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "data/passwordInfo.json",
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    fields: {
                        custid: { type: "string" },
                        sessionid: { type: "string" },
                        password: { type: "string" },
                        newpassword: { type: "string" }, 
                        confirmpassword: { type: "string" },
                        ref: { type: "string" },
                        info: { type: "string" },
                        error: { type: "string" }
                  }
                }
            }
        })

    });
    
    app.bankingPasswordService = {

        viewModel: BankingPasswordViewModel,
        
        init: function (initEvt) {         
            app.bankingPasswordService.viewModel.passwordInfo.read();
            
            var x = 1;
            var view = initEvt.view;
            
            view.element.find("#pwdone").data("kendoMobileButton").bind("click", function() {
                app.bankingPasswordService.viewModel.passwordInfo.one("change", function() {
                    view.loader.hide();
                    app.application.navigate("#:back");
                    //window.kendoMobileApplication.navigate("#:back");
                });

                view.loader.show();
                var ds = app.bankingPasswordService.viewModel.passwordInfo;
                app.bankingPasswordService.viewModel.passwordInfo.sync();
            });

            view.element.find("#pwcancel").data("kendoMobileBackButton").bind("click", function(e) {
                e.preventDefault();
                app.bankingPasswordService.viewModel.passwordInfo.one("change", function() {
                    view.loader.hide();
                    app.application.navigate("#:back");
                    //window.kendoMobileApplication.navigate("#:back");
                });

                view.loader.show();
                app.bankingPasswordService.viewModel.passwordInfo.cancelChanges();
            });
            
        },
        beforeShow: function (beforeShowEvt) {              
        },
        show: function (showEvt) {},
       
        validate: function () {
            if(validator.validate()) {
                alert("success");
            } else {
                //scroll back to top
                app.view().scroller.reset();
            }
        },

        clear: function () {
            //clear values of the inputs
            $("#password-listview").find("input:not([type=checkbox])").val("");
            $("#password-listview").find("input[type=checkbox]").attr('checked', false);
            //hide validation messages
            $(".validation-summary .k-invalid-msg").hide();
            //scroll back to top
            app.view().scroller.reset();        
        }
        
    };
})(window);