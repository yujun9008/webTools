//background js
function sendMessageToContentScript(message, callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, message, function(response){
			if(callback) callback(response);
		});
	});
}
 

// 存储所有连接的端口
let ports = [];

// 监听来自内容页面的连接
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'track-analyzer') {
	console.log('新的连接建立:', port.name);
    ports.push(port);
    
    // 当端口断开时移除
    port.onDisconnect.addListener(() => {
		console.log('连接断开:', port.name);
      ports = ports.filter(p => p !== port);
    });
  }
});

// 监听网络请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
	console.log('新请求:', details);
    if (details.url.startsWith('https://mooclog.youdao.com/track/w/?data=')) {
      // 向所有连接的端口发送消息
	  console.log('匹配到打点请求:', details.url); // 添加日志
      ports.forEach(port => {
        port.postMessage({
          type: 'track-request',
          url: details.url
        });
      });
    }
  },
  { urls: ["*://*.youdao.com/*"] }
);
 
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