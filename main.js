var shapes = ["rectangle","circle","square","ellipse"];
var shapeObj;
$(document).ready(function(){
  initialize_dom();
  $('div.calc .calc-buttons a').on("click",initialize_dom);
  $('div#calc-step-3.calc .calc-buttons button').click(initialize_dom);
  $('div#calc-step-1.calc .calc-buttons button').click(function(){
    var currentStepSelector = 'div#calc-step-1.calc';
    var nextStepSelector = 'div#calc-step-2.calc';
    var shape = $(currentStepSelector+' input[name="shapes"]:checked').val();
    replaceInDom(nextStepSelector, shape);
    shapeObj = areaCalculator(shapes.indexOf(shape.toLowerCase()));
    var domElements = [];
    shapeObj.paramInfo.forEach(function(p,index){
      var textInput = inputElement_2("text");
      domElements.push( initCaps(p)+"&nbsp;"+textInput("param"+(index+1),"","units") );
    });
    insertHtmlIntoDivChild(nextStepSelector, ".calc-options", domElements);
    showOnly(nextStepSelector);
  });
  $('div#calc-step-2.calc .calc-buttons button').click(function(){
    var currentStepSelector = 'div#calc-step-2.calc';
    var nextStepSelector = 'div#calc-step-3.calc';
    var params=[];
    $(currentStepSelector+' .calc-options input').each(function(val){
      params.push($(this).val());
    });
    var area = shapeObj.areaDefinition(params);
    var desc = shapeObj.desc(params);
    replaceInDom(nextStepSelector, desc);
    var domElements = "The Area is "+area+".";
    insertHtmlIntoDivChild( nextStepSelector, ".calc-options", [areaResultElement(area)] );
    showOnly(nextStepSelector);
  });
});

function initialize_dom() {
  var options = [];
  var radioInput = inputElement("radio");
  var radioInputChecked = inputElement("radio",true);
  shapes.forEach(function(shape,index){
    if (index==0)
      options.push(radioInputChecked("shapes",shape));
    else
      options.push(radioInput("shapes",shape));
  });
  $('div#calc-step-1.calc .calc-options').html(options.join("<br>"));
  showOnly('div#calc-step-1.calc');
}

function showOnly(selector) {
  var all = ['div#calc-step-1.calc','div#calc-step-2.calc','div#calc-step-3.calc'];
  all.forEach(function(s){
    if (selector == s)
      $(s).show();
    else
      $(s).hide();
  });
}

function Shape(paramInfo,shapeId) {
  this.paramInfo=paramInfo;
  this.shapeId=shapeId;
  this.desc=function(params){
    var s=shapes[shapeId]+" with a ";
    paramInfo.forEach(function(element,index){
      paramInfo[index]=paramInfo[index].concat(" "+params[index]);
    });
    s=s.concat(concatArray(paramInfo));
    return s;
  };
}

function concatArray(arr){
  var and = " and ";
  var separator = ", "
  if (arr.length > 2) {
    return arr.slice(-1).join(separator).concat(and).concat(arr.slice(arr.length-1));
  }
  else {
    return arr.join(and);
  }
}

function areaCalculator (shapeId) {
  var pi=3.14;
  switch(shapeId) {
    case 0:
      return new Shape(
        ["length","breadth"],
        shapeId,
        Shape.prototype.areaDefinition = function (...args) {
            return args[0][0]*args[0][1];
        }
      );
      break;
    case 1:
      return new Shape(
        ["radius"],
        Shape.prototype.areaDefinition = function (...args) {
          return pi*args[0][0]*args[0][0];
        }
      );
      break;
    case 2:
      return new Shape(
        ["side"],
        Shape.prototype.areaDefinition = function (...args) {
          return args[0][0]*args[0][0];
        }
      );
      break;
    case 3:
      return new Shape(
        ["a-axis","b-axis"],
        Shape.prototype.areaDefinition = function (...args) {
          return pi*args[0][0]*args[0][1];
        }
      );
      break;
    default:
      return new Shape(
        ["unknown"],
        Shape.prototype.areaDefinition = function (...args) {
          return -1;
        }
      );
  }
}

function initCaps(str){
  return str.charAt(0).toUpperCase().concat(str.slice(1));
}

function inputElement(type,checked=false){
  return function(name,value){
    return '<input type="'+type+'" value="'+value+'" name="'+name+'"'+(checked?"checked":"")+'>'+initCaps(value);
  };
}

function inputElement_2(type){
  return function(name,value,placeholder=""){
    return '<input type="'+type+'" value="'+value+'" name="'+name+'"'+(placeholder==''?'':'placeholder="'+placeholder+'"')+'>';
  };
}

function replaceInDom(selector,shapeName){
  replaceInDomUndo(selector);
  var $jqObj = $(selector+' .calc-desc')
  $jqObj.html(
    $jqObj.text().replace(/{}/g,surroundSpan(shapeName))
  );
}

function replaceInDomUndo(selector){
  var $jqObj = $(selector+' .calc-desc')
  $jqObj.text(
    $jqObj.html().replace(/<span.*span>/g,"{}")
  );
}

function surroundSpan(str) {
  return '<span class="shape-desc">'+str+'</span>'
}

function areaResultElement(area){
  return '<h3>The Area is '+area+'.</h3>';
}

function insertHtmlIntoDivChild(selector,childClass,html) {
  $(selector+' '+childClass).html(html.join("<br>"));
}
