"use strict";

$(function(){

var nameInput = $("#name"),
    mailInput = $("#mail"),
    jobTitleSelection = $("#title"),
    shirtSizeSelection = $("#size"),
    shirtDesignSelection = $("#design"),
    shirtColorSelection = $("#color"),
    activities = $(".activities")[0],

    paymentSelection = $("#payment"),

    creditCardNumber = $("#cc-num"),
    creditCardZipCode = $("#zip"),
    creditCardCVV = $("#cvv"),

    paypalInfo = $("#paypal-info"),
    bitcoinInfo = $("#bitcoin-info");

nameInput.focus();

paypalInfo.hide();
bitcoinInfo.hide();

$("form").on("submit",function(e){
  e.preventDefault();

  var submittedName = nameInput.val();
  var submittedEmail = mailInput.val();

  //remove any previous errors
  if($(".error-box")){
    $(".error-box").each(function(){
      $(this).remove();
    });
  }

  if(!checkforValidEmail(submittedEmail)){
    mailInput.after('<div class="error-box"><p>Please provide a valid email address</p></div>');
  }

  if(!submittedName){
    nameInput.after('<div class="error-box"><p>Name cannot be left blank</p></div>');
  }

  if(!checkForActivity()){
    $('<div class="error-box"><p>At least one activity must be selected</p></div>').insertAfter(".activities");
  }

  //check for valid payment method
  if(paymentSelection.val() === "select_method"){
    paymentSelection.after('<div class="error-box"><p>Please select a payment method</p></div>');
  }

  //validate credit card
  if(paymentSelection.val() === "credit card"){

    //show error if no cvv given or is not a 3 digit number
    if(!creditCardCVV.val() || !checkForThreeDigits(creditCardCVV.val())){
        $("#credit-card").after('<div class="error-box"><p>Please provide a 3 digit credit card CVV number</p></div>');
    }
    //show error if no credit card number given or is not a number
    if(!creditCardZipCode.val() || isNaN(parseInt(creditCardZipCode.val()))){
      $("#credit-card").after('<div class="error-box"><p>Please provide a credit card zip code</p></div>');
    }
    //show error if no zip given or is not a number
    if(!creditCardNumber.val() || isNaN(parseInt(creditCardNumber.val()))){
      $("#credit-card").after('<div class="error-box"><p>Please provide a credit card number</p></div>');
    }

  }

});

jobTitleSelection.on("change",function(){
  var jobTitle = $(this).val();
  if(jobTitle === "other"){
    var otherTitleInput = '<input type="text" id="other-title" placeholder="Your Title">';
    $(this).after(otherTitleInput);
    $("#other-title").focus();
  }else{
    if($("#other-title")){
      $("#other-title").remove();
    }
  }
});

shirtDesignSelection.on("change",function(){
  var shirtDesign = $(this).val();
  shirtDesign = shirtDesign.toLowerCase();
  var firstItemInSelection = true;

  $("#color > option").each(function(){
    var assoctiatedDesign = $(this).data("design");
    //hide colors that aren't associated with the chosen design
    if(shirtDesign !== assoctiatedDesign && shirtDesign !== "select theme"){
      $(this).hide();
    }else{
      //select the color associated with the shirt design
      if(firstItemInSelection){
          $(this).prop("selected",true);
          firstItemInSelection = false;
      }
      $(this).show();
    }
  });
});

paymentSelection.on("change",function(){
  //only show paypal info when paypal option is selected
  if($(this).val() === "paypal"){
    paypalInfo.show();
    bitcoinInfo.hide();
  //only show bitcoin info when
  }else if($(this).val() === "bitcoin"){
    bitcoinInfo.show();
    paypalInfo.hide();
  //hide payment info if neither paypal or bitcoin is selected
  }else{
    paypalInfo.hide();
    bitcoinInfo.hide();
  }
});


//handle click events for activities
$(".activities input").each(function(e){
  $(this).bind("click",function(){
    var clickedCheckbox = $(this);
    checkForTimeClashes(clickedCheckbox);
    var totalCostDisplay = "<label id='total-cost'>Total Cost: " + getCost() + "$</label>";
    if(!$("#total-cost").text()){
      $(".activities label:last-child").after(totalCostDisplay);
    }else if(getCost() === 0){
      $("#total-cost").remove();
    }else{
      $("#total-cost").text("Total Cost: " + getCost() + "$");
    }
  });
});

//check for clashes between activities and disable any other activities that clash with
//chosen activities
function checkForTimeClashes(clickedCheckbox){
  $(".activities input").each(function(e){
    var checkboxAtCurrentindex = $(this);

      //check for overlapping days and times
      if(clickedCheckbox.parent().text() !== checkboxAtCurrentindex.parent().text() &&
         clickedCheckbox.data("day") === checkboxAtCurrentindex.data("day") &&
         parseInt(checkboxAtCurrentindex.data("start")) >= parseInt(clickedCheckbox.data("start")) &&
         parseInt(checkboxAtCurrentindex.data("finish")) <= parseInt(clickedCheckbox.data("finish"))){
         if(clickedCheckbox.prop("checked")){
            //disable activity if it clashes with an activity that is already checked
            checkboxAtCurrentindex.attr("disabled",true);
            checkboxAtCurrentindex.parent().css("color","grey");
         }else{
           checkboxAtCurrentindex.attr("disabled",false);
           checkboxAtCurrentindex.parent().css("color","black");
         }
      }
  });
}

//calculate cost of chosen activities
function getCost(){
  var cost = 0;
  $(".activities input").each(function(e){
    if($(this).prop("checked")){
      cost += parseInt($(this).data("cost"));
    }
  });
  return cost;
}

function checkforValidEmail(email){
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//check for at least one activity chosen
function checkForActivity(){
  var activityChecked = false;
  $(".activities input").each(function(e){
    if($(this).prop("checked")){
      activityChecked = true;
    }
  });
  return activityChecked;
}

function checkForThreeDigits(input){
  var re = /^\d{3}$/;
  return re.test(input)
}

});
