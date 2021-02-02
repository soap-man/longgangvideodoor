const express = require('express');
const app = express();
const request = require('request');

app.listen(80, ()=>console.log('服务启动'));

//电脑登陆微信，然后登陆龙岗视频门禁，点击开门，抓包在接口请求和返回结果header,body中找参数

console.log(process.env.USERDOMAIN_ROAMINGPROFILE);

//https://lggafw.com/v1.5/spmj/door/open-door 开门接口
const phonesnno = process.env.PHONESNNO;
const wechatopenid = process.env.WECHATOPENID;
const xAuthToken = process.env.XAUTHTOKEN;
const doorDeviceId = process.env.DOORDEVICEID;
//查询开门结果id(在返回结果中id字段,下面是随便设的一个,会在请求开门接口后重写)
global.commandId = "c8b0b61d-e689-4c9c-9e28-e7bdb35f0bf4";

//https://lggafw.com/v1.5/spmj/door/open-door-result 开门结果查询接口
const buildName = process.env.BUILDNAME;
const facilityName = process.env.FACILITYNAME;
const brandtype = process.env.BRANDTYPE;
const sn = process.env.SN;
const bluetoothMac = process.env.BLUETOOTHMAC;

app.get('/open', (req, res)=>{
    var options = {
        'method': 'POST',
        'url': 'https://lggafw.com/v1.5/spmj/door/open-door',
        'headers': {
            'Host': 'lggafw.com',
            'Connection': 'keep-alive',
            'Content-Length': '22',
            'SDKVersion': '2.12.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'appversion': 'v1.6.5',
            'content-type': 'application/json',
            'phonesnno': phonesnno,
            'phonetype': 'microsoft',
            'systype': 'wechat',
            'sysversion': 'Windows 10 x64',
            'wechatopenid': wechatopenid,
            'wechatversion': '7.0.9',
            'x-auth-token': xAuthToken,
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://servicewechat.com/wx3d2e6845f76fe4ca/68/page-frame.html'
        },
        body: JSON.stringify({"doorDeviceId":doorDeviceId})
    };
    request(options, function (error, response) {
        global.commandId = JSON.parse(response.body).id;
        console.log(global.commandId);
        res.json(global.commandId);
    })
});

app.get('/status', (req,res)=>{
    console.log(global.commandId);
    var optionsStatus = {
        'method': 'POST',
        'url': 'https://lggafw.com/v1.5/spmj/door/open-door-result',
        'headers': {
            'Host': 'lggafw.com',
            'Connection': 'keep-alive',
            'Content-Length': '207',
            'SDKVersion': '2.12.1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
            'appversion': 'v1.6.5',
            'content-type': 'application/json',
            'phonesnno': phonesnno,
            'phonetype': 'microsoft',
            'systype': 'wechat',
            'sysversion': 'Windows 10 x64',
            'wechatopenid': wechatopenid,
            'wechatversion': '7.0.9',
            'x-auth-token': xAuthToken,
            'Referer': 'https://servicewechat.com/wx3d2e6845f76fe4ca/68/page-frame.html',
            'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify({"commandId":global.commandId,"buildName":buildName,"facilityName":facilityName,"brandtype":brandtype,"sn":sn,"bluetoothMac":bluetoothMac})
    };
    request(optionsStatus, function (error, response) {
        console.log(response.body);
        res.json(JSON.parse(response.body).message);
    });
});






