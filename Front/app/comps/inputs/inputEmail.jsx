import GenericInput from "./inputGeneric";


export default function InputEmail(props) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const toolTipData = `Seu e-mail para recuperar a senha do ${siteName}.`;
  const placeholder = 'Digite um e-mail para seu usuario';

  function validateEmail(value) {
    props.setValid(
      value.includes('@') && value.includes("mail.com")
    );
  };

  return (
    <GenericInput 
      value={props.value}
      setValue={props.setValue}
      valid={props.valid}
      validate={validateEmail}

      type={"email"}
      name={"email"}
      placeholder={placeholder}

      toolTipData={toolTipData}
    />
  )
}