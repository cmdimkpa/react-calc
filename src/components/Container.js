import '../styles/App.css';
import Button from './Button';

function readIntermediate(){
  return window.localStorage.getItem("MYCALC_INTERMEDIATE");
}

function Container() {
  return (
    <div className="App">
      <div>
        <Button type="DISPLAY" width={4*60} height={1.5*60} display={readIntermediate()}/><br/>
        <Button type="DIGIT_7"/><Button type="DIGIT_8"/><Button type="DIGIT_9"/><Button type="OPERATOR_+"/><br/>
        <Button type="DIGIT_4"/><Button type="DIGIT_5"/><Button type="DIGIT_6"/><Button type="OPERATOR_-"/><br/>
        <Button type="DIGIT_1"/><Button type="DIGIT_2"/><Button type="DIGIT_3"/><Button type="OPERATOR_/"/><br/>
        <Button type="DIGIT_0"/><Button type="DIGIT_."/><Button type="C"/><Button type="OPERATOR_*"/><br/>
        <Button type="EQUAL" width={4*60}/>
      </div>
    </div>
  );
}

export default Container;
