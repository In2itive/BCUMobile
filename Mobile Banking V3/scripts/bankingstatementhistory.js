(function(global) {  
    var BankingStatementHistoryViewModel,
        app = global.app = global.app || {};
    
    BankingStatementHistoryViewModel = kendo.data.ObservableObject.extend({
        bankingStatementHistoryInfoDataSource: null,
        bankingStatementHistoryDataSource: null,
        
        init: function () {
            var that = this,
                dataSource;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/statementInfo.json",
                        dataType: "json"
                    }
                }
            });
            
            that.set("bankingStatementHistoryInfoDataSource", dataSource);     
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/statementData.json",
                        dataType: "json"
                    }
                },
                group: { field: "date" }
            });
            
          
            
            that.set("bankingStatementHistoryDataSource", dataSource); 
        }        
    });     
    
    app.bankingStatementHistoryService = {
        viewModel: new BankingStatementHistoryViewModel()
    };
})(window);