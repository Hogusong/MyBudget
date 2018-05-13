var DOM = {
  month: document.getElementById('month'),
  budget: document.getElementById('budget'),
  inTotal: document.getElementById('in-total'),
  exTotal: document.getElementById('ex-total'),
  percentage: document.getElementById('percentage'),
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
      data.id[type] += 1
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

    updatePercentages: function () {
      data.allItems.exp.forEach(function (item) {
        item.calcPercentage;
      });
    },

    getExpensesArray: function () {
      return data.allItems.exp;
    },

    getIncomeArray: function () {
      return data.allItems.inc;
    },

    getData: function () {
      return data;
    }
  }
})();

var UIController = function () {

}

var Controll = function (UICtrl, DataCtrl) {

}(UIController, DataController)
