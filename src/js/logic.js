// Calculator Logic

let STATE_REGISTER = {
    OPERAND_A : "",
    OPERAND_B : "",
    OPERATOR : null,
    RESULT : ""
 }
 
 let toggle_A_over_B = true;
 
 function C_Pressed(){
    // clear the calculator memory
    STATE_REGISTER["OPERAND_A"] = "";
    STATE_REGISTER["OPERAND_B"] = "";
    STATE_REGISTER["OPERATOR"] = null;
    STATE_REGISTER["RESULT"] = "";
 } 
 
 function EQUAL_Pressed(){
    // perform the operation:  OPERAND_A (OPERATOR) OPERAND_B
    toggle_A_over_B = true;
    let RESULT = eval(`${STATE_REGISTER["OPERAND_A"]} ${STATE_REGISTER["OPERATOR"]} ${STATE_REGISTER["OPERAND_B"]}`);
    STATE_REGISTER["OPERAND_A"] = "";
    STATE_REGISTER["OPERAND_B"] = "";
    STATE_REGISTER["RESULT"] = RESULT;
    return RESULT;
 }
 
 function OPERATOR_Pressed(OPERATOR){
   toggle_A_over_B = false;
   STATE_REGISTER["OPERATOR"] = OPERATOR;
   if (STATE_REGISTER["RESULT"] !== "") STATE_REGISTER["OPERAND_A"] = STATE_REGISTER["RESULT"];
 }
 
 function DIGIT_Pressed(DIGIT){
   if (toggle_A_over_B) {
      STATE_REGISTER["OPERAND_A"] += DIGIT;
   } else {
     STATE_REGISTER["OPERAND_B"] += DIGIT;
   }
 }

 module.exports = {
    C_Pressed,
    EQUAL_Pressed,
    DIGIT_Pressed,
    OPERATOR_Pressed
 }