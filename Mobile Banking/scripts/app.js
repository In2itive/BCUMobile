(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        
        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout", statusBarStyle: "black-translucent"});
        app.application.skin("flat");
        app.appType = localStorage.getItem("appType");
        
        if (app.appType === undefined || app.appType === null || app.appType === "null") {
			app.appType = "Dev";
		}
        console.log(localStorage.getItem("appType"));
        
    }, false);

    app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };
    
    app.errorObj = {errorCode: 0, errorStr: "", errorStr2: "", errorStr3: "", errorCancel: "", errorBack: "", errorLogin: ""}
    
    app.testshow = function (e) {
        console.log("testshow has run");
    }
})(window);