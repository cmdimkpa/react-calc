import '../styles/App.css';
import '../js/logic';

function Button(props){
    // determine button display
    let displayMap = {
        C : "CLR",
        EQUAL : "=",
        DIGIT_DOT : "."
    }

    let colorMap = {
        C : "red",
        EQUAL : "grey",
        DIGIT_DOT : "grey"
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

    return (
      <button style={{
        "width": props.width ? props.width : 60, 
        "height": 60, 
        "background-color":colorMap[props.type],
        "color" : "white",
        "font-family" : "arial",
        "font-size" : 22,
        "font-weight" : "bold"
      }}>{displayMap[props.type]}</button>
    )
}

export default Button