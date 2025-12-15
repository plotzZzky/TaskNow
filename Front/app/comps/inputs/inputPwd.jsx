import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, } from '@fortawesome/free-solid-svg-icons'
import GenericInput from './inputGeneric'


export default function InputPwd(props) {
  const [pwdVisible, setPwdVisible] = useState(false)
  const toolTipData = "A senha precisa de letras, numeros e ao menos 8 digitos"
  const placeholder = props.confirm? "Confirme a sua senha" : "Digite a sua senha"
  const valueLength = 8;

  function changePwdVisibility() {
    setPwdVisible(pwdVisible? false : true);
  };

  function validatePwd(value) {
    props.setValid(
      value.length >= valueLength && findChar(value)
    );
  };
  
  function findChar(text) {
    // Verifica se na senha tem ao menos uma letra ou numero
    const char = [...text].some((char) => /[a-zA-Z]/.test(char));
    const digit = [...text].some((char) => /\d/.test(char));
    return char && digit;
  }

  const EYES_ICON = () => {
    return (
      <div id='inputIconsAlign'>
        <div className='pwd-visible' onClick={changePwdVisibility}>
          { pwdVisible? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }
        </div>
      </div>
    )
  };

  return (
    <GenericInput 
      value={props.value}
      setValue={props.setValue}
      valid={props.valid}
      validate={validatePwd}

      type={pwdVisible? 'text': 'password'}
      name={"password"}
      placeholder={placeholder}

      EYES={EYES_ICON()}

      toolTipData={toolTipData}
    />
  )
}