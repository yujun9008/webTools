import { useEffect, useState } from "react";
import { List, Button, Collapse, message } from "antd";
// import { LeftOutlined } from "@ant-design/icons";
// import { Link } from "react-router-dom";
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
    let reconnectTimer: number;
    let port: any;

    const connectToExtension = () => {
      try {
        // 连接到 background script
        port = (window as any).chrome.runtime.connect({
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
          // 断开连接后尝试重连
          reconnectTimer = window.setTimeout(connectToExtension, 300);
        });

        setIsExtensionConnected(true);
      } catch (error) {
        console.error("连接扩展失败:", error);
        // 连接失败后也尝试重连
        reconnectTimer = window.setTimeout(connectToExtension, 300);
      }
    };

    // 初始连接
    connectToExtension();

    return () => {
      // 清理工作
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (port) {
        port.disconnect();
      }
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
      {/* <Link to="/" className="item-home">
        <LeftOutlined /> Track Analyzer
      </Link> */}

      <div className="track-cotainer">
        <h3>哈勃打点请求列表</h3>
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
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            const copyBtn = e.currentTarget.querySelector('.copy-btn');
                            if (copyBtn) {
                              (copyBtn as HTMLElement).style.visibility = 'visible';
                              (copyBtn as HTMLElement).style.opacity = '1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            const copyBtn = e.currentTarget.querySelector('.copy-btn');
                            if (copyBtn) {
                              (copyBtn as HTMLElement).style.visibility = 'hidden';
                              (copyBtn as HTMLElement).style.opacity = '0';
                            }
                          }}
                        >
                          <span>{getEventId(item.decodedData)}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              className="copy-btn"
                              style={{
                                visibility: "hidden",
                                opacity: 0,
                                transition: "visibility 0s, opacity 0.2s linear",
                                border: "1px dashed #868686",
                                color: "#868686",
                                background: "none",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(getEventId(item.decodedData)).then(() => {
                                  message.success("已复制到剪贴板");
                                });
                              }}
                            >
                              复制
                            </button>
                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          </div>
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
