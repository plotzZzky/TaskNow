
export default function ImgInput(props) {
  
  function clickInput() {
    // Ao clickar na imagem aciona o input
    document.getElementById('selectImgUser').click();
  };

  function changeImage(event) {
    const file = event.target.files[0];
    props.setImageUser(file);
    const reader = new FileReader();

    reader.onload = function (event) {
      props.setFileUser(event.target.result)
    }
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <img id='imgPreview' onClick={clickInput} src={props.getFileUser} />
      <input type="file" id='selectImgUser' onChange={changeImage} />
    </div>
  )   
} 