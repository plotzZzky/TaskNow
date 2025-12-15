import GenericInput from "./inputGeneric";


export default function InputAnswer(props) {
  const toolTipData = "Digite a resposta para sua pergunta de recuperação de senha."
  const placeholder = 'Digite a resposta para sua pergunta de recuperação';
  const valueLength = 3;

  function ValidateAnswer(value) {
    props.setValid(
      value.length > valueLength
    );
  };

  return (
    <GenericInput 
      value={props.value}
      setValue={props.setValue}
      valid={props.valid}
      validate={ValidateAnswer}

      type={"text"}
      name={"answer"}
      placeholder={placeholder}

      toolTipData={toolTipData}
    />
  )
}