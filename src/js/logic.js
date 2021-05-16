// Calculator Logic

let STATE_REGISTER = {
    OPERAND_A : "",
    OPERAND_B : "",
    OPERATOR : null,
    RESULT : ""
 }
 
 let toggle_A_over_B = true;

 function writeIntermediate(intermediate){
     window.localStorage.setItem("MYCALC_INTERMEDIATE", intermediate);
 }
 
 function C_Pressed(dummy=null){
    // clear the calculator memory
    STATE_REGISTER["OPERAND_A"] = "";
    STATE_REGISTER["OPERAND_B"] = "";
    STATE_REGISTER["OPERATOR"] = null;
    STATE_REGISTER["RESULT"] = "";
    writeIntermediate("0");
 }

 function safelyEvaluate(){
     try {
         let operand_A = +STATE_REGISTER["OPERAND_A"];
         let operand_B = +STATE_REGISTER["OPERAND_B"];
         let operator = STATE_REGISTER["OPERATOR"];
         let result;
         if (operator==="+") result = operand_A + operand_B;
         if (operator==="-") result = operand_A - operand_B;
         if (operator==="*") result = operand_A * operand_B;
         if (operator==="/") result = operand_A / operand_B;
        return result;
     } catch(err){
         console.log(err)
         return null
     }
 }
 
 function EQUAL_Pressed(dummy=null){
    // perform the operation:  OPERAND_A (OPERATOR) OPERAND_B
    toggle_A_over_B = true;
    let RESULT = safelyEvaluate() || STATE_REGISTER["RESULT"]
    STATE_REGISTER["OPERAND_A"] = "";
    STATE_REGISTER["OPERAND_B"] = "";
    STATE_REGISTER["RESULT"] = RESULT;
    writeIntermediate(RESULT);
 }
 
 function OPERATOR_Pressed(OPERATOR){
   toggle_A_over_B = false;
   STATE_REGISTER["OPERATOR"] = OPERATOR;
   if (STATE_REGISTER["RESULT"] !== "") STATE_REGISTER["OPERAND_A"] = STATE_REGISTER["RESULT"];
 }
 
 function DIGIT_Pressed(DIGIT){
   if (toggle_A_over_B) {
      STATE_REGISTER["OPERAND_A"] += DIGIT;
      writeIntermediate(STATE_REGISTER["OPERAND_A"]);
   } else {
     STATE_REGISTER["OPERAND_B"] += DIGIT;
     writeIntermediate(STATE_REGISTER["OPERAND_B"]);
   }
 }

 module.exports = {
     DIGIT_Pressed,
     C_Pressed,
     OPERATOR_Pressed,
     EQUAL_Pressed
 }