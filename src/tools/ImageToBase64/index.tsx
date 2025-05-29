import { Upload, message, Button } from 'antd';
import { InboxOutlined, LeftOutlined, CopyOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const { Dragger } = Upload;

function Component() {
  const [base64String, setBase64String] = useState<string>('');

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: async (file: File) => {
      try {
        const base64 = await convertToBase64(file);
        setBase64String(base64);
        message.success(`${file.name} 转换成功`);
      } catch (error) {
        message.error(`${file.name} 转换失败`);
      }
      return false; // 阻止自动上传
    },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64String);
      message.success('Copy success');
    } catch (err) {
      message.error('Copy failed');
    }
  };

  return (
    <>
      <Link to="/" className="item-home">
        <LeftOutlined /> Image toBase64
      </Link>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag the image to this area</p>
        <p className="ant-upload-hint">Support single or batch upload</p>
      </Dragger>
      
      {base64String && (
        <div className="result-container">
          <h4>Conversion result:</h4>
          <div className="preview">
            <img src={base64String} alt="预览" style={{ maxWidth: '200px' }} />
          </div>
          <div className="base64-container">
            <textarea 
              value={base64String} 
              readOnly 
              rows={8}
              style={{ width: '100%', marginTop: '16px' }}
            />
            <Button 
              icon={<CopyOutlined />}
              onClick={handleCopy}
              className="copy-button"
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Component;