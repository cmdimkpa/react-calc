import '../styles/App.css';
const {
    DIGIT_Pressed,
    OPERATOR_Pressed,
    EQUAL_Pressed,
    C_Pressed
} = require('../js/logic');

function DISPLAY_Pressed(dummy=null){}

function doSomething(key, value){
    let clickStr = `${key}_Pressed(${value})`
    eval(clickStr);
}

function Button(props){
    // determine button display
    let displayMap = {
        C : "CLR",
        EQUAL : "=",
        "DIGIT_." : ".",
        DISPLAY : (props.display || "0").substring(0,16)
    }

    let colorMap = {
        C : "red",
        EQUAL : "grey",
        "DIGIT_." : "grey",
        DISPLAY : "white"
    }

    for (let digit=0; digit <= 9; digit++){
        displayMap[`DIGIT_${digit}`] = `${digit}`;
        colorMap[`DIGIT_${digit}`] = 'grey';
    }

    let operators = ["+", "-", "*", "/"];

    for (let operator of operators){
        displayMap[`OPERATOR_${operator}`] = `${operator}`;
        colorMap[`OPERATOR_${operator}`] = 'orange';
    }

    let key,
        value;
    let parts = props.type.split("_");
    if (parts.length === 2){
        [key, value] = parts;
        value = `'${value}'`;
    } else {
        [key] = parts;
        value = "";
    }

    return (
      <button style={{
        "width": props.width || 60, 
        "height": props.height || 60, 
        "background-color":colorMap[props.type],
        "color" : props.type == "DISPLAY" ? "black" : "white",
        "font-family" : "arial",
        "font-size" : props.type == "DISPLAY" ? 26 : 22,
        "font-weight" : "bold",
        "text-align" : props.type == "DISPLAY" ? "left" : "center"
      }} onClick={(e) => {e.preventDefault(); doSomething(key, value)}}>{displayMap[props.type]}</button>
    )
}

export default Button