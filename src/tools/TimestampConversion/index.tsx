import "./index.css";
import { Input, Button, Space, message } from "antd";
import { LeftOutlined, CopyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Component() {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [inputTimestamp, setInputTimestamp] = useState<string>("");
  const [dateTimeStr, setDateTimeStr] = useState<string>("");
  const [timestampResult, setTimestampResult] = useState<string>("");
  const [dateTimeResult, setDateTimeResult] = useState<string>("");

  // 更新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  // 时间戳转日期时间
  const timestampToDateTime = (timestamp: string) => {
    if (!timestamp) return;
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      setDateTimeResult(date.toLocaleString());
    } catch (error) {
      message.error('请输入有效的时间戳');
    }
  };

  // 日期时间转时间戳
  const dateTimeToTimestamp = (dateTime: string) => {
    if (!dateTime) return;
    try {
      const date = new Date(dateTime);
      setTimestampResult(Math.floor(date.getTime() / 1000).toString());
    } catch (error) {
      message.error('日期时间格式不正确');
    }
    
  };

  return (
    <>
      <Link to="/" className="item-home">
        <LeftOutlined /> Timestamp Conversion
      </Link>

      <div style={{ margin: '20px 0' }}>
        <h3>当前时间戳</h3>
        <Space>
          <Input value={currentTimestamp} readOnly style={{ width: '200px' }} />
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(currentTimestamp.toString())}>
            复制
          </Button>
        </Space>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>时间戳转日期时间</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Input 
              placeholder="输入时间戳" 
              value={inputTimestamp}
              onChange={(e) => setInputTimestamp(e.target.value)}
              style={{ width: '200px' }}
            />
            <Button type="primary" onClick={() => timestampToDateTime(inputTimestamp)}>转换</Button>
          </Space>
          {dateTimeResult && (
            <div>
              转换结果: {dateTimeResult}
              <Button 
                icon={<CopyOutlined />} 
                onClick={() => copyToClipboard(dateTimeResult)}
                style={{ marginLeft: '10px' }}
              >
                复制
              </Button>
            </div>
          )}
        </Space>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>日期时间转时间戳</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Input 
              value={dateTimeStr}
              onChange={(e) => setDateTimeStr(e.target.value)}
              style={{ width: '200px' }}
            />
            <Button onClick={() => dateTimeToTimestamp(dateTimeStr)}>转换</Button>
          </Space>
          {timestampResult && (
            <div>
              转换结果: {timestampResult}
              <Button 
                icon={<CopyOutlined />} 
                onClick={() => copyToClipboard(timestampResult)}
                style={{ marginLeft: '10px' }}
              >
                复制
              </Button>
            </div>
          )}
        </Space>
      </div>
    </>
  );
}

export default Component;
