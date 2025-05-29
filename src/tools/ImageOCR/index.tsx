// import { Upload, message, Button, Spin } from 'antd';
// import { InboxOutlined, LeftOutlined, CopyOutlined } from '@ant-design/icons';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { createWorker } from 'tesseract.js';
// import * as Tesseract from 'tesseract.js';
// import './index.css';

// const { Dragger } = Upload;

// function Component() {
//   const [imageUrl, setImageUrl] = useState<string>('');
//   const [ocrResult, setOcrResult] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   const performOCR = async (file: File) => {
//     try {
//       setLoading(true);
//       const worker = await createWorker({
//         workerPath: 'https://unpkg.com/tesseract.js@v4.0.0/dist/worker.min.js',
//         langPath: 'https://tessdata.projectnaptha.com/4.0.0',
//         corePath: 'https://unpkg.com/tesseract.js-core@v4.0.0/tesseract-core.wasm.js',
//       });
      
//       await worker.loadLanguage('eng+chi_sim');
//       await worker.initialize('eng+chi_sim');
      
//       const { data: { text } } = await worker.recognize(file);
//       setOcrResult(text);
//       await worker.terminate();
//       message.success('识别完成');
//     } catch (error) {
//       message.error('识别失败');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadProps = {
//     name: 'file',
//     multiple: false,
//     accept: 'image/*',
//     beforeUpload: async (file: File) => {
//       setImageUrl(URL.createObjectURL(file));
//       await performOCR(file);
//       return false;
//     },
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(ocrResult);
//       message.success('复制成功');
//     } catch (err) {
//       message.error('复制失败');
//     }
//   };

//   return (
//     <>
//       <Link to="/" className="item-home">
//         <LeftOutlined /> 图片文字识别
//       </Link>
//       <Dragger {...uploadProps}>
//         <p className="ant-upload-drag-icon">
//           <InboxOutlined />
//         </p>
//         <p className="ant-upload-text">点击或拖拽图片到此区域</p>
//         <p className="ant-upload-hint">支持单个图片上传</p>
//       </Dragger>
      
//       {loading && (
//         <div className="loading-container">
//           <Spin tip="正在识别中..." />
//         </div>
//       )}
      
//       {imageUrl && (
//         <div className="result-container">
//           <h4>图片预览：</h4>
//           <div className="preview">
//             <img src={imageUrl} alt="预览" style={{ maxWidth: '300px' }} />
//           </div>
//         </div>
//       )}

//       {ocrResult && (
//         <div className="result-container">
//           <h4>识别结果：</h4>
//           <div className="ocr-container">
//             <textarea 
//               value={ocrResult} 
//               readOnly 
//               rows={8}
//               style={{ width: '100%' }}
//             />
//             <Button 
//               icon={<CopyOutlined />}
//               onClick={handleCopy}
//               className="copy-button"
//             >
//               复制
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Component; 