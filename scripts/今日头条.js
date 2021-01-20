auto.waitFor();

// 禁止脚本多次运行
var list = engines.all();
var my = engines.myEngine()
for (var i = 0; i < list.length; i++) {
    if (my['source'] == list[i]['source'] && my['id'] != list[i]['id']) {
        list[i]['source'].forceStop()
    };
};

setScreenMetrics(1080, 1920);
device.keepScreenOn()

// 唤醒屏幕
if (!device.isScreenOn()) {
    device.wakeUp();
    sleep(1000);
}

// 解锁屏幕
var keyguard_manager = context.getSystemService(context.KEYGUARD_SERVICE);
var isUnlocked = () => !keyguard_manager.isKeyguardLocked();
if (!isUnlocked()) {
    swipe(500, 30, 500, 1000, 300);
    sleep(1000);
    click(100, 120);
    sleep(1000);
}

var appName = "今日头条";
var downloadUrl = 'https://d.toutiao.com/PqXU?apk=1';

// 打开App
var packageName = getPackageName(appName);

if (!packageName) {
    toast('未安装' + appName + ', 开始安装');
    importClass(java.io.File);
    importClass(android.os.Environment);
    importClass(com.stardust.util.IntentUtil);
    importClass(com.stardust.auojs.inrt.Pref);
    importClass(android.app.DownloadManager);

    var fileName = appName + '.apk';
    var file = new File(Environment.getExternalStoragePublicDirectory("Download"), fileName);
    if (file.exists()) {
        file.delete();
    }
    var manager = context.getSystemService(context.DOWNLOAD_SERVICE);
    var request = DownloadManager.Request(android.net.Uri.parse(downloadUrl));
    request.setDestinationInExternalPublicDir("Download", fileName);
    var downloadId = manager.enqueue(request);
    sleep(10000);
    var query = new DownloadManager.Query().setFilterById(downloadId);
    var cursor = manager.query(query);
    if (cursor.moveToFirst()) {
        var status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
        while (DownloadManager.STATUS_SUCCESSFUL != status) {
            toast(status);
            sleep(1000);
        }
        toast(status);
    }

    IntentUtil.installApkOrToast(context, file.getPath(), "com.stardust.auojs.inrt.lshfileprovider")
    toast('等待' + appName + '安装结束');
    sleep(3000);

    if (text('本次允许').exists()) {
        text('本次允许').click();
        sleep(1000);
    }

    if (text('允许').exists()) {
        text('允许').click();
        sleep(1000);
    }

    if (text('继续安装').exists()) {
        text('继续安装').click();
        sleep(1000);
    }

    if (text('安装').exists()) {
        text('安装').click();
        sleep(1000);
    }
}

while (!packageName) {
    sleep(1000);
    packageName = getPackageName(appName);
    if (packageName) {
        toast('安装完成');
        sleep(3000);
        if (text('完成').exists()) {
            text('完成').click();
        }
        sleep(1000);
    }
}

back();

// 已打开的先关闭
if (currentPackage() == packageName) {
    toast(appName + '已在运行中');
    app.openAppSetting(currentPackage());
    sleep(2000);
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        textMatches(/(.*确.*|.*定.*)/).findOne().click();
        toast(appName + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        toast(appName + "应用不能被正常关闭或不在后台运行");
        back();
    }
}

home();

toast('启动' + appName);
var r = app.launchApp(appName);
sleep(1000);

if (text('允许').exists()) {
    text('允许').click();
    sleep(1000);
}

waitForPackage(packageName);
toast(appName + '已启动');

sleep(3000);

if (text('同意').exists()) {
    text('同意').click();
    sleep(1000);
}

while (text('允许').exists()) {
    text('允许').click();
    sleep(1000);
}

while (text('始终允许').exists()) {
    text('始终允许').click();
    sleep(1000);
}

if (text('流畅模式').exists()) {
    text('取消').click();
    sleep(1000);
}

/**
 * 今日头条读新闻
 */
var menus = [
    '历史',
    '体育',
    '健康',
    '军事',
    '财经',
    '科技',
    '要问',
    '美食',
    '国际',
];

for (var i = 1; i <= 20; i++) {
    sleep(3000);
    if (id("blj").exists()) {
        id("blj").click();
        sleep(1500);
    }
    toast("今日头条极速版读新闻第" + i + "次");
    let menu = menus[Math.floor(Math.random() * menus.length)];
    if (text(menu).exists()) {
        let b = text(menu).findOne().bounds();
        click(b.centerX(), b.centerY());
        sleep(5000);
        // 刷新一次
        swipe(500, 500, 500, 1500, 1000);
        sleep(5000);
        let news = className("androidx.recyclerview.widget.RecyclerView").findOne();
        if (news != null) {
            let b = news.bounds();
            click(b.centerX(), b.centerY());
            for (var x = 1; x <= 15; x++) {
                toast("今日头条极速版读新闻第" + i + "次" + "滑动第" + x + "次");
                swipe(303, 1000, 335, 50, 500);
                sleep(1500);
            }
            back();
        }
    }
}
sleep(1000);

/**
 * 今日头条检索关键字
 */
var searchKeyWord = [
    'AutoJs教程',
    'RNN',
    'CNN',
    'HMM',
    'LSTM',
    '人工智能的出路',
    'Java的出路',
    'AI的出路',
    'DOTNET未来',
    'C#的出路',
    'Android教程',
    'IOS教程',
    'MAC教程',
    'XCODE教程',
    'IOS还有未来吗',
    'uniapp教程',
    '编辑距离',
    '欧式距离',
    '隐马尔可夫链',
    '云计算',
    '云存储',
    'Iaas',
    'AI',
    'AI和教育',
];

if (id('ds1').exists()) {
    let s = id('ds1').findOnce();
    click(s.bounds().centerX(), s.bounds().centerY());
    sleep(3000);

    for (i = 0; i < 5; i++) {
        let keyWord = searchKeyWord[Math.floor(Math.random() * searchKeyWord.length)];
        className("android.widget.EditText").setText(keyWord)
        if (text('搜索').exists()) {
            text('搜索').click();
            sleep(5000);
        }
    }

    back();
    sleep(2200);
    back();
    sleep(2200);
    home();
}

exit();