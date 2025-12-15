import GenericInput from "./inputGeneric";


export default function InputQuestion(props) {
  const toolTipData = "Essa pergunta sera usada para recuperar a sua senha caso você esqueça.";
  const placeholder = 'Digite a sua pergunta de recuperação de senha';
  const valueLength = 3;

  function validateQuestion(value) {
    props.setValid(value.length > valueLength);
  };

  return (
    <GenericInput 
      value={props.value}
      setValue={props.setValue}
      valid={props.valid}
      validate={validateQuestion}

      type={"text"}
      name={"question"}
      placeholder={placeholder}

      toolTipData={toolTipData}
    />
  )
}