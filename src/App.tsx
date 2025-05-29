import './App.css'
import hand_pointIcon from './assets/hand_point_right.svg'

import { Link } from "react-router-dom";
function App() {
console.log(location.href)
  return (
    <>
      <h1>Web Tools</h1>
      <div className="tools-container">
        
        <Link to="/tools/base64" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" /><p><b>Base64</b><br /> decode & encode </p>
        </Link>
        <Link to="/tools/json" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" /><p> <b>JSON</b><br /> Formatting </p>  
        </Link>
        <Link to="/tools/imageToBase64" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" /><p> <b>Image</b><br /> to Base64 </p>    
        </Link>
        <Link to="/tools/timestampConversion" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" /><p> <b>Timestamp</b><br /> </p>    
        </Link>
        <Link to="/tools/trackAnalyzer" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" /><p> <b>哈勃打点</b><br /> Request Analysis </p>    
        </Link>
        {/* <Link to="/tools/imageOCR" className='tool-item'> 
        <img src={hand_pointIcon} alt="icon" />Image OCR
        </Link> */}
      </div>
      <footer>
        <p>Copyright © Jun</p>
      </footer>
    </>
  )
}

export default App
