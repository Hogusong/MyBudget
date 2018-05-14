var DOMstring = {
  month: document.getElementById('month'),
  budget: document.getElementById('budget'),
  inTotal: document.getElementById('in-total'),
  exTotal: document.getElementById('ex-total'),
  percentage: document.getElementById('percentage'),
  desc: document.querySelector('.description'),
  type: document.getElementById('type'),
  amount: document.querySelector('.amount'),
  process: document.querySelector('.btn-process')
}

var DataController = (function () {
  var Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  var Expense = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function () {
    if (data.totals.inc > 0) {
      this.percentage = Math.round(this.value / data.totals.inc * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

  var data = {
    allItems: { inc: [], exp: [] },
    totals: { inc: 0, exp: 0 },
    id: { inc: 0, exp: 0 }
  };

  return {
    addItem: function (type, desc, value) {
      var newItem, ID;
      ID = data.id[type]
      if (type === "inc") {
        newItem = new Income(ID, desc, value);
      } else {
        newItem = new Expense(ID, desc, value);
      }

      data.allItems[type].push(newItem);
      data.totals[type] += value;
      data.id[type] += 1;
      return newItem;
    },

    deleteItem: function (type, id) {
      var count = 0, index = -1;
      data.allItems[type].forEach(function(item) {
        if (item.id === id) {
          index = count;
          return
        }
        count ++;
      });
      if (index > -1) {
        data.totals[type] -= data.allItems[type][index].value;
        data.allItems[type].splice(index, 1) // remove 1 item
      }
    },
    // Get total income and expenses.
    getTotals: function () {
      return data.totals;
    },

    updateData: function () {

    },
  
    updatePercentages: function () {
      data.allItems.exp.forEach(function (item) {
        item.calcPercentage;
      });
    },

    getExpensesArray: function () {
      return data.allItems.exp;
    },

    getData: function () {
      return data;
    }
  }
})();

var UIController = (function () {
  var getMonth = function () {
    var now, year, month, months;
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    now = new Date();
    year = now.getFullYear();
    month = months[now.getMonth()];
    return month + ', ' + year;
  };

  var formatValue = function (value) {
    //  fix the number with 2 decimal point and split it by '.'
    var numSplit = value.toFixed(2).split('.');

    //  change format : 12345678 => 12,345,678
    var x = numSplit[0];
    var num ;
    if (x.length > 3) {
      if (x.length % 3 === 0){
          num = x.substr(0, 3);
      } else {
          num = x.substr(0, (x.length % 3));
      }
    } else {
        num = x;
    }
    x = x.substr(num.length, x.length);
    while (x.length > 0) {
        num = num + ',' + x.substr(0, 3);
        x = x.substr(3, x.length);
    };    

    return '$ ' + num + '.' + numSplit[1]; 
  }

  return {
    getInput: function () {
      return {
        type: DOMstring.type.value,
        desc: DOMstring.desc.value.trim(),
        value: parseFloat(DOMstring.amount.value)
      }
    },

    addListItem: function (obj, type) {

    },

    clearFields: function () {
      var fields = [DOMstring.desc, DOMstring.amount];
      fields.forEach(function(field) {
        field.value = '';
      });
      fields[0].focus();
    },

    showBudget: function (in_total, ex_total) {
      var budget = in_total - ex_total;
      var percentage = '----';
      if (in_total > 0) {
        percentage = (ex_total/in_total * 100).toFixed(2);
      }
      DOMstring.month.textContent = getMonth();
      if (budget < 0) {
        DOMstring.budget.innerHTML = '- ' + formatValue(-budget);
      } else {
        DOMstring.budget.innerHTML = formatValue(budget);
      }
      DOMstring.inTotal.innerHTML = formatValue(in_total);
      DOMstring.exTotal.innerHTML = '- ' + formatValue(ex_total);
      DOMstring.percentage.innerHTML = percentage + '%';
    },

    displayPercentages: function (items) {

    }
  }
})();

// Global App Controler
var Controller = (function (UICtrl, DataCtrl) {
  var setupEvents = function () {
    DOMstring.process.addEventListener('click', addNewItem);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        addNewItem();
      }
    })
  };

  var addNewItem = function () {
    var item = UICtrl.getInput();
    if (item.value > 0 && item.desc != '') {
      var newItem = DataCtrl.addItem(item.type, item.desc, item.value);

      // UICtrl.addListItem(newItem, item.type);

      UICtrl.clearFields();

      DataCtrl.updateData() ;

      var totals = DataCtrl.getTotals();
      UICtrl.showBudget(totals.inc, totals.exp);

      if (item.type === "inc") {
        DataCtrl.updatePercentages();
        var items = DataCtrl.getExpensesArray();
        UICtrl.displayPercentages(items);
      } 
    } else {
      alert('Invalid input. Check the description and the value amount.')
    }
  };

  var deleteItem = function (event) {

  };

  return {
    start: function () {
      UICtrl.showBudget(0, 0);
      setupEvents();
    }
  }
})(UIController, DataController);

Controller.start();