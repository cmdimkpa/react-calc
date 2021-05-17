// Calculator Logic

let stateRegister = {
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
    stateRegister.operandA = "";
    stateRegister.operandB = "";
    stateRegister.operator = null;
    stateRegister.result = "";
    writeIntermediate("0");
 }

 function safelyEvaluate(){
     try {
         let operand_A = +stateRegister.operandA;
         let operand_B = +stateRegister.operandB;
         let operator = stateRegister.operator;
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
    let RESULT = safelyEvaluate() || stateRegister.result
    stateRegister.operandA = "";
    stateRegister.operandB = "";
    stateRegister.result = RESULT;
    writeIntermediate(RESULT);
 }
 
 function OPERATOR_Pressed(OPERATOR){
   if (stateRegister.operandB !== "") EQUAL_Pressed();
   toggle_A_over_B = false;
   stateRegister.operator = OPERATOR;
   if (stateRegister.result !== "") stateRegister.operandA = stateRegister.result;
 }
 
 function DIGIT_Pressed(DIGIT){
   if (toggle_A_over_B) {
      stateRegister.operandA += DIGIT;
      writeIntermediate(stateRegister.operandA);
   } else {
     stateRegister.operandB += DIGIT;
     writeIntermediate(stateRegister.operandB);
   }
 }

 module.exports = {
     DIGIT_Pressed,
     C_Pressed,
     OPERATOR_Pressed,
     EQUAL_Pressed
 }
