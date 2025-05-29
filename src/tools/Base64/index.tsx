import "./index.css";
import { Button, Input, Checkbox } from "antd";
import { LeftOutlined, SwapOutlined } from "@ant-design/icons";
import { useState } from "react";
import { encode, decode } from "js-base64";
import { Link } from "react-router-dom";
import JsonView from "react18-json-view";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import "react18-json-view/src/style.css";

function Component() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [isJson, setIsJson] = useState(false);
  const handleEncode = () => {
    const result = encode(value);
    setResult(result);
  };

  const handleDecode = () => {
    const result = decode(value);
    setResult(result);
  };

  const handleSwap = () => {
    setValue(result);
    setResult(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  const handleIsJson = (e: CheckboxChangeEvent) => {
    setIsJson(e.target.checked);
  };
  return (
    <>
      <Link to="/" className="item-home">
        <LeftOutlined /> base64
      </Link>
      <h5>请输入要进行 Base64 编码或解码的字符</h5>
      <Input.TextArea value={value} onChange={handleChange} rows={6} />
      <p className="button-group">
        <Button onClick={handleDecode}>解码(decode)</Button>
        <Button onClick={handleEncode} type="primary">
          编码(encode)
        </Button>
        <Button
          icon={<SwapOutlined />}
          className="swap-button"
          onClick={handleSwap}
        >
          交换
        </Button>
      </p>
      <h5>
        Base64 编码或解码的结果：
        <span>
          <Checkbox className="checkbox-json" onChange={handleIsJson}>
            以 JSON格式展示
          </Checkbox>
        </span>
      </h5>

      {isJson && result ? (
        <JsonView src={JSON.parse(result)} />
      ) : (
        <Input.TextArea value={result} rows={8} />
      )}
    </>
  );
}

export default Component;
