import { useEffect, useState } from "react";
import { List, Button, Collapse } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./index.css";
import { decode } from "js-base64";
import JsonView from "react18-json-view";

interface TrackItem {
  url: string;
  data: string;
  decodedData: string;
  timestamp: number;
}

function Component() {
  const [trackList, setTrackList] = useState<TrackItem[]>([]);
  const [isExtensionConnected, setIsExtensionConnected] = useState(false);

  useEffect(() => {
    // 连接到 background script
    // 声明 chrome 全局变量类型
    const port = (window as any).chrome.runtime.connect({
      name: "track-analyzer",
    });

    // 监听来自 background script 的消息
    port.onMessage.addListener((message: { type: string; url: string }) => {
      if (message.type === "track-request") {
        try {
          const url = message.url;
          const urlObj = new URL(url);
          const data = urlObj.searchParams.get("data") || "";
          const decodedData = decode(data);

          setTrackList((prev) => [
            ...prev,
            {
              url,
              data,
              decodedData,
              timestamp: Date.now(),
            },
          ]);
        } catch (error) {
          console.error("解析请求失败:", error);
        }
      }
    });

    // 检查连接状态
    port.onDisconnect.addListener(() => {
      setIsExtensionConnected(false);
    });

    setIsExtensionConnected(true);

    return () => {
      port.disconnect();
    };
  }, []);

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text).then(() => {
  //     message.success("已复制到剪贴板");
  //   });
  // };

  const getEventId = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      return data.eventId || "未知事件";
    } catch (error) {
      return "解析失败";
    }
  };

  const clearTrackList = () => {
    setTrackList([]);
  };

  return (
    <>
      <Link to="/" className="item-home">
        <LeftOutlined /> Track Analyzer
      </Link>

      <div className="track-cotainer">
        <h3>打点请求分析</h3>
        <Button type="link" onClick={clearTrackList}>
            清空
          </Button>
        {!isExtensionConnected && (
          <div style={{ color: "#ff4d4f", marginBottom: "16px" }}>
            提示：请确保已安装并启用 Chrome 扩展
          </div>
        )}
        <List
          dataSource={trackList}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <Collapse
                  ghost
                  items={[
                    {
                      key: "1",
                      label: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{getEventId(item.decodedData)}</span>
                          <span>
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ),
                      children: (
                        <div>
                          <div
                            style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all",
                            }}
                          >
                            <JsonView src={JSON.parse(item.decodedData)} />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default Component;
