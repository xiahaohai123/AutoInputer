auto.waitFor(); // 等待授权开启辅助功能
console.log("start to do something");
// 注册AccessibilityService
var service = auto.service;
if (!service) {
    toast("请先开启辅助功能");
    exit();
}
console.log("got service: ", service);

toastLog("now package 0 is: " + currentPackage())

app.launchPackage("com.tencent.mm")

toastLog("now package 1 is: " + currentPackage())

waitForPackage("com.tencent.mm")

toastLog("now package 2 is: " + currentPackage())

let searchButtonSelector = selector().clickable(true).longClickable(true).desc("搜索").className("android.widget.RelativeLayout");
// let searchButton = selector().id('gsl')
let searchButton = searchButtonSelector.findOnce();

searchButton.click()



console.log("back exists: ", searchButton)