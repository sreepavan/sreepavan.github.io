var BillController=(function(){
    
    var cost = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var discount = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var tax = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var data={
        allitems:{
            cost : [],
            disc : [],
            tax : []
        },
        totals : {
            cost : 0,
            disc : 0,
            tax : 0
        },
        bill :0
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allitems[type].forEach(function(cur) {
            sum += parseFloat(cur.value);
        });
        data.totals[type] = sum;
    };
   
    
    
    
    
    return {
        addItem : function(type, description, value){
            
            var newItem,id;
            
            if(data.allitems[type].length>0)
                id=data.allitems[type][data.allitems[type].length-1].id+1;
            else
                id=0;
            
            if(type === "cost"){
                newItem = new cost(id, description, value);
            }
            else if(type === "disc"){
                newItem = new discount(id, description, value);
            }
            else{
                newItem=new tax(id, description, value);
            }
            
            data.allitems[type].push(newItem);
            return newItem;
            
        },
         
    calculateBill : function(){
    
        calculateTotal('cost');
        calculateTotal('disc');
        calculateTotal('tax');
        
        var total = parseFloat(data.totals.cost) - parseFloat(data.totals.disc) + parseFloat(data.totals.tax) ;
        console.log(total);
        data.bill=total;

    },
        
        getBill: function() {
            return {
                
                bill: data.bill,
                totalCost: data.totals.cost,
                totalDisc: data.totals.disc,
                totalTax: data.totals.tax
                
            };
        }
    };
    
    
})();

var UIController= (function(){
    
    var DOMStrings={
        
      inputType : '.add__type',
      inputdescription : '.add__description',
      inputvalue : '.add__value',
      inputbtn : '.add__btn',
      costcontainer : '.income__list',
      discountcontainer : '.expenses__list',
      taxcontainer : '.tax__list',
        billlabel:'.budget__value',
        costlabel:'.budget__income--value',
        taxlabel:'.budget__tax--value',
        discountlabel:'.budget__expenses--value'
      
    };
    
    return {
      
        getInput : function(){
            return{
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputdescription).value,
                value : document.querySelector(DOMStrings.inputvalue).value
            };
        },
        
               
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'cost') {
                element = DOMStrings.costcontainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value% $</div></div></div>';
                
            } else if (type === 'disc') {
                element = DOMStrings.discountcontainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value% $</div><div>&nbsp</div></div></div>';
                
            } else {
                element = DOMStrings.taxcontainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description% </div><div class="right clearfix"><div class="item__value">%value% $</div><div>&nbsp</div></div></div>';        
                
            }
            
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        displayBill: function(obj) {
            console.log(obj);
            document.querySelector(DOMStrings.billlabel).textContent = obj.bill+' $';
            document.querySelector(DOMStrings.costlabel).textContent = obj.totalCost+' $';
            document.querySelector(DOMStrings.discountlabel).textContent = obj.totalDisc+ ' $';
            document.querySelector(DOMStrings.taxlabel).textContent = obj.totalTax+ ' $';
            
        },
        
        clearfields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputdescription + ', ' + DOMStrings.inputvalue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        getDOMStrings :function(){
            return DOMStrings;
        }
        
    };
    
    
})();


var Controller=(function(bctrl,uictrl){

    var DOM=uictrl.getDOMStrings();
    var setEventListener=function(){
      
        document.querySelector(DOM.inputbtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
    };
    
    var updateBill = function() {
        
        bctrl.calculateBill();
        
        var bill=bctrl.getBill();
        
        uictrl.displayBill(bill);
    };
    
    
    var ctrlAddItem=function(){
        
        var input = uictrl.getInput();
        //console.log(input);
        var newItem = bctrl.addItem(input.type, input.description, input.value);
        //console.log(newItem);
        uictrl.addListItem(newItem,input.type);
        uictrl.clearfields();
        
        updateBill(); 
        
    };
    
    
    return{
            init : function(){
            uictrl.displayBill ({
                bill :0,
                totalDisc:0,
                totalCost:0,
                totalTax:0,
                totalInc: 0,
                totalExp: 0
            });
            setEventListener();
        
        }
    };
    
    /*
        1. Get input from UI on click   (*)
        2. Create object from the input (*)
        3. Add this newitem to UI       (*)
        4. Clear fields                 (*)
        5. Update Bill                  (*)
        6. Display Bill                 (*)
        7. Update Percentage
        8. Display Percentage
    */
    
    
    
})(BillController,UIController);
Controller.init();
