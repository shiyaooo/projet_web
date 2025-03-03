import {useState, useEffect} from 'react';
import axios from 'axios';
import './NewSpread.css';
import PhotoPic from '../../Icones/UploadPic.png';

export default function NewSpread(props){
    // const [isloading, setIsLoading] = useState(true);
    const [contenu, setcontenu] = useState('');
    const [postPhoto, setPostPhoto] = useState(null);
    const [file, setFile] = useState();
    const [placeholder, setPlaceholder] = useState('');



    // 这个 useEffect 会使 placeholder 的内容逐个字符显示句子。每显示一个句子后，会切换到下一个句子，循环执行，直到组件卸载或 useEffect 重新执行
    useEffect(() => {
      // 初始化数据
      const phrases = ['What a beautiful day               ', 'I am not a big fan of this new social media               ', 'My cat is yellow               ', `SpreadApp c'est pour les nuls               `];
      let count = 0; // 用来记录当前句子的索引
      let index = 0;
      let currentPhrase = '';

      // 设置定时器： setInterval 设置了一个定时器，每隔 100 毫秒执行一次。
      let intervalId = setInterval(() => {
        currentPhrase += phrases[count][index];
        setPlaceholder(currentPhrase);
        index++;
        if (index === phrases[count].length) {
          index = 0;
          count++;
          if (count === phrases.length) {
            count = 0;
          }
          currentPhrase = '';
        }
      }, 100);
      
      // 清理定时器, 当组件卸载或 useEffect 重新执行时，会调用 clearInterval 来清除定时器，防止内存泄漏。
      return () => clearInterval(intervalId);
    }, []);

    function handlecontenuChange(event) {
        setcontenu(event.target.value);
    }
    
    function handleImageChange(event) {
      setPostPhoto(event.target.files[0]);
    }

    function handleSubmit(event) {
        // 阻止表单的默认提交行为（防止页面刷新）
        event.preventDefault();

        // 创建一个 FormData 对象，用于处理表单数据
        const formData = new FormData();

        // 如果没有图片和内容，直接返回，不做任何操作
        if (!postPhoto && !contenu) return;
      
        // 如果内容不为空，将内容（文本）添加到 formData 中
        if (contenu !== '') formData.append("contenu", contenu);
        
        // 如果存在上传的图片，将图片文件添加到 formData 中
        if (postPhoto) {
            formData.append("file", postPhoto);
        }

        axios.post(`http://localhost:5000/posts/${props.user._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);

          // console.log("avant reset " + props.reset);

          props.setReset(!props.reset);

          // console.log("apres reset " + props.reset);
          alert("Spread posté !");
          setcontenu('');
          setPostPhoto(null);
          setFile();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // 用于在 postPhoto 发生变化时处理图片文件的读取
    useEffect(() => {
      if (postPhoto) {

        // 创建一个 FileReader 实例，用于读取文件内容
        const reader = new FileReader();

        // 文件读取完成后的回调函数
        reader.onload = () => {
          // 将文件内容存储到组件状态中
          setFile(reader.result);
        };
        
        // 以数据URL格式读取文件
        reader.readAsDataURL(postPhoto);
      }
    }, [postPhoto]);

    const handleDeletePicButton=()=>{
      setFile();
      setPostPhoto(null);
    }

    // 用于让用户发布带有文本和可选图片的内容
    return (
        <form onSubmit={handleSubmit} className='form_posting'>
          {/* 文本框，绑定了 value 和 onChange */}
          <textarea id='textareaposting' value={contenu} placeholder={placeholder} onChange={handlecontenuChange} />
          <div className='down-NewSpread'>
              {/* 隐藏的文件上传按钮 */}
              <input type="file" id="upload_NewSpread" onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
              {/* 点击图片图标，触发文件上传 */}
              <img src={PhotoPic} onClick={() => document.getElementById("upload_NewSpread").click()} id='PicUploadIcone'/>
              
              {/* 如果文件已被选中，显示预览和删除按钮 */}
              {file ?
              <div className='img_loaded_NS'>
                <img src={file} alt="selected image" id='selected_image' height='100em'  />
                <button id='buttonforPic' onClick={handleDeletePicButton}>X</button>
              </div>
              : <br/>}

              {/* 提交按钮 */}
              <button id='buttonposting' type="submit" /*onClick={()=>props.setReset(!props.reset)}*/>Post a spread</button>
          </div>
          
        </form>
    );
};