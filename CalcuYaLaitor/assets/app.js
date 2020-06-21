var arrHead = new Array();
arrHead = ['', '']; // table headers.
const DATA_ARR = ["num_operations", "operation_type", "min", "max", "total"];
var OPERATION_TYPES = new Map()
OPERATION_TYPES.set(" + ", "<span>&#43;</span>");
OPERATION_TYPES.set(" - ", "<span>&#8722;</span>");
OPERATION_TYPES.set(" x ", "<span>&#215;</span>");
OPERATION_TYPES.set(" : ", "<span>&#247;</span>");
var need_totals = [" + ", " - "];



// first create a TABLE structure by adding few headers.
function createTable() {
  var empTable = document.createElement('table');
  empTable.setAttribute('id', 'empTable'); // table id.

  var tr = empTable.insertRow(-1);

  for (var h = 0; h < arrHead.length; h++) {
    var th = document.createElement('th'); // the header object.
    // th.innerHTML = arrHead[h];
    tr.appendChild(th);

  }

  var div = document.getElementById('cont');
  div.appendChild(empTable); // add table to a container.
  for (let key of OPERATION_TYPES.keys()) {
    addRow(key);
  }
}

// function to add new row.
function addRow() {
  var operation_type = arguments[0] || " + ";
  var empTab = document.getElementById('empTable');

  var rowCnt = empTab.rows.length; // get the number of rows.
  var tr = empTab.insertRow(rowCnt); // table row.
  tr.setAttribute("id", rowCnt);
  // tr = empTab.insertRow(rowCnt);

  for (var c = 0; c < arrHead.length; c++) {
    var td = document.createElement('td'); // TABLE DEFINITION.
    td = tr.insertCell(c);

    if (c == 0) { // if its the first column of the table.
      // add a button control.
      var button = document.createElement('input');

      // set the attributes.
      button.setAttribute('type', 'button');
      button.setAttribute('value', 'Remove');

      // add button's "onclick" event.
      button.setAttribute('onclick', 'removeRow(this)');

      td.appendChild(button);
    } else {
      // the 2nd, 3rd and 4th column, will have textbox.
      td.append("I want ");
      td.appendChild(createInput("num_operations", rowCnt, 5));
      td.append(" operations of type ");
      td.appendChild(createTypeSelect("operation_type", rowCnt, operation_type));
      if (need_totals.includes(operation_type)) {
        td.append(" that don't have a total bigger than ");
        td.appendChild(createInput("total", rowCnt, 100));
      } else {
        td.append(" with numbers between ");
        td.appendChild(createInput("min", rowCnt, 1));
        td.appendChild(createInput("max", rowCnt, 10));
      }
    }
  }
}

// function to delete a row.
function removeRow(oButton) {
  var empTab = document.getElementById('empTable');
  empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); // buttton -> td -> tr
}

// function to extract and submit table data.
function handleClick(event) {
  var arrValues = new Map();
  var myTab = document.getElementById('empTable');
  for (r = 1; r < myTab.rows.length; r++) {
    var row = myTab.rows[r];
    var id = row.getAttribute('id');
    var row_data = new Map();
    for (c = 0; c < DATA_ARR.length; c++) {
      var var_name = DATA_ARR[c] + id;
      var data = document.getElementById(var_name);
      if (data) {
        row_data.set(DATA_ARR[c], data.value);
      }

    }
    arrValues.set(r, row_data);
  }
  var days_tables = [];
  var days = document.getElementById('how_many_days').value;
  for (var d = 1; d <= days; d++) {
    days_tables.push(createOperations(arrValues));
  }
  var win = window.open('', 'wnd');
  win.document.body.innerHTML = days_tables.join("");

}


function createInput(id, rowCnt, def_value) {
  var ele = document.createElement('input');
  ele.setAttribute('type', 'text');
  ele.setAttribute('value', def_value);
  ele.setAttribute('id', id + rowCnt);
  return ele;
}

function createTypeSelect(id, rowCnt, operation_type) {
  //Creat`e and append select list
  var selectList = document.createElement("select");
  selectList.id = id + rowCnt;

  //Create and append the options
  for (let key of OPERATION_TYPES.keys()) {
    var option = document.createElement("option");
    option.value = key;
    option.text = key;
    if (operation_type == key) {
      option.setAttribute("selected", true);
    }
    selectList.appendChild(option);
  }
  return selectList;
}

function createOperations(arrValues) {
  var calcs = [];
  calcs.push("<table style='border:1px solid;margin: 0px auto;font-size: 24px; ' width='80%'>");
  var count_rows = 1;
  for (let value of arrValues.values()) {
    if (count_rows == 1) {
      calcs.push("<tr>");
    }
    calcs.push("<td>");
    var num_op = value.get(DATA_ARR[0]);
    var op_type = value.get(DATA_ARR[1]);
    var image_op = OPERATION_TYPES.get(op_type);
    calcs.push("<table style='font-size: 24px; margin: 0px auto;' width='80%'>");
    calcs.push("<tr><td style='text-align: center; vertical-align: middle;font-size: 42px;color:blue;'>" + image_op + "</td></tr>");
    for (var i = 0; i < num_op; i++) {
      calcs.push("<tr>")
      var min = value.get(DATA_ARR[2]) || 1;
      var max = value.get(DATA_ARR[3]) || 100;
      var total = value.get(DATA_ARR[4]);
      var calcs_td = getTdByRules(min, max, op_type, total);
      calcs.push(calcs_td);
      calcs.push("</tr>");
    }
    calcs.push("</table>");
    calcs.push("</td>");

    if (count_rows % 2 == 0) {
      calcs.push("</tr><tr>");
    }
    ++count_rows;
  }
  calcs.push("</tr></table>")
  return calcs.join('');
}


function getTdByRules(min, max, op_type, total) {
  var num_1 = Math.floor((Math.random() * max) + min);
  var num_2 = calcRandomNumByOperationType(num_1, max, op_type, total);
  return "<td  style='border:1px solid;'>" + num_2 + op_type + num_1 + " = " + "&emsp;&emsp;" + "</td>";
}

function calcRandomNum() {
  var max = arguments[0] || 100;
  var min = arguments[1] || 1;
  return Math.floor(Math.random() * (max - min)) + min;
}

function calcRandomNumByOperationType(min, max, op_type, total) {
  var number = calcRandomNum(max);
  if (op_type == " + ") {
    number = calcRandomNum(total - min);
  }
  if (op_type == " - ") {
    number = calcRandomNum(max,min);
    number = number > total ? (total - number) : number;
  }
  if (op_type == " : ") {
    number = calcRandomNum(max) * min;

  }
  return number;
}
