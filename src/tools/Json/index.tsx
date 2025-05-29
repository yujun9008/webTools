import "./index.css";
import { Input } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

function Component() {
  const [value, setValue] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);

  const isJsonValid = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValidJson(newValue === "" || isJsonValid(newValue));
  };

  return (
    <>
      <Link to="/" className="item-home">
        <LeftOutlined /> JSON Formatting
      </Link>
      <h5>Please enter the data that needs to be formatted</h5>
      <Input.TextArea
        value={value}
        onChange={handleChange}
        rows={6}
        status={!isValidJson ? "error" : ""}
      />
      {!isValidJson && <div style={{ color: "red" }}>Invalid JSON format</div>}
      {value && isValidJson && <JsonView src={JSON.parse(value)} />}
    </>
  );
}

export default Component;
