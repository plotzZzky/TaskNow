import GenericInput from './inputGeneric';


export default function InputUser(props) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const toolTipData = `Seu nome de usuário será usado para entrar no ${siteName} e deve ter ao menos 3 letras.`;
  const placeholder = 'Digite um nome para seu usuario';
  const valueLength = 3;

  function validateUser(value) {
    props.setValid(value.length >= valueLength);
  };

  return (
    <GenericInput 
      value={props.value}
      setValue={props.setValue}
      valid={props.valid}
      validate={validateUser}

      type={"text"}
      name={"username"}
      placeholder={placeholder}

      toolTipData={toolTipData}
    />
  )
}