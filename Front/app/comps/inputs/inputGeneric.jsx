import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'
import './inputs.css'


export default function GenericInput(props) {
  const toolTipData =  props.toolTipData;

  useEffect(() => {
    props.validate(props.value || "") // Faz a validação do valor recebido via value do input
  }, [props.value, props.validate])

  function genericValidate(event) {
    // Função generica usada para evitar codigo duplicado
    const value = event.target.value;
    props.validate(value); // Função de validação especifica de cada input derivado desse
    props.setValue(value);
  };

  const ICONS = () => { // Retorna o icone de valido/invalido
    return (
      <span className='input-div-icon'>
        { props.valid?
          <FontAwesomeIcon icon={faCheck} className='icon-input-validate'/>
          : <FontAwesomeIcon icon={faX} className='icon-input' />
        }
      </span>
    )
  };

  const EYES_ICON = () => { // Usado para exibir o icone para mostrar no inputPwd
    return (
      <>
        {props.EYES? props.EYES : null}
      </>
    )
  };

  return (
    <div className='div-input'
      data-tooltip-id="toolTip"
      data-tooltip-content={toolTipData}
      data-tooltip-place={props.toolTipPosition || "top"}
    >
      <input
        value={props.value}
        onChange={genericValidate}

        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        min={props.minLeght}
      />
      
      {EYES_ICON()}

      {ICONS()}
    </div>
  )
}