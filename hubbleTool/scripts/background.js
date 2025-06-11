//background js
// function sendMessageToContentScript(message, callback){
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
// 		chrome.tabs.sendMessage(tabs[0].id, message, function(response){
// 			if(callback) callback(response);
// 		});
// 	});
// }

// 存储所有连接的端口
let ports = [];
let isInitialized = false;

// 用于存储已处理的请求 ID，避免重复处理
const processedRequests = new Set();

// 初始化扩展
function initializeExtension() {
  if (isInitialized) return;
  
  // 监听网络请求
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // 检查是否已经处理过这个请求
      if (processedRequests.has(details.requestId)) {
        return;
      }

      if (details.url.includes('mooclog.youdao.com/track/w')) {
        console.log('匹配到打点请求:', details.url);
        
        // 记录已处理的请求 ID
        processedRequests.add(details.requestId);
        
        // 设置一个定时器来清理请求 ID，避免内存泄漏
        setTimeout(() => {
          processedRequests.delete(details.requestId);
        }, 5000); // 5秒后清理

        // 向所有连接的端口发送消息
        ports.forEach(port => {
          try {
            port.postMessage({
              type: 'track-request',
              url: details.url
            });
          } catch (error) {
            console.error('发送消息失败:', error);
            // 移除失效的端口
            ports = ports.filter(p => p !== port);
          }
        });
      }
    },
    { urls: ["*://*.youdao.com/*"] }
  );
  
  isInitialized = true;
}

// 监听来自内容页面的连接
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'track-analyzer') {
    console.log('新的连接建立:', port.name);
    
    // 确保扩展已初始化
    initializeExtension();
    
    // 添加到连接池
    if (!ports.includes(port)) {
      ports.push(port);
    }
    
    // 发送连接成功消息
    try {
      port.postMessage({
        type: 'connection-status',
        status: 'connected'
      });
    } catch (error) {
      console.error('发送状态消息失败:', error);
    }
    
    // 当端口断开时处理
    port.onDisconnect.addListener(() => {
      console.log('连接断开:', port.name);
      ports = ports.filter(p => p !== port);
    });
  }
});

// chrome.contextMenus.create({
//     id: "send_panel",
// 	title: '使用侧边栏处理：%s', // %s表示选中的文字
// 	contexts: ['all'] // 只有当选中文字时才会出现此右键菜单
// });
// chrome.contextMenus.onClicked.addListener(function(params, tab){
//     if(params.menuItemId=='send_panel'){
//         console.log(params.selectionText);
//         chrome.sidePanel.open({ windowId: tab.windowId });
//         sendMessageToContentScript({cmd:'test', value:params.selectionText}, function(response){
// 	        console.log('来自content的回复：'+response);
//         });
//     }
// });

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));