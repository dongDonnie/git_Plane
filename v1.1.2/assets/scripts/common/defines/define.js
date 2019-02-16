var Define = module.exports;

//UI分层
Define.LayerEnum = {
	UI:"UINode",		//UI层，主城UI元素所在层
	WND:"WndNode",		//窗口层
	MSG:"MsgNode",		//弹出消息，战力涨跌，全屏公告等
	GUIDE:"GuideNode",	//引导层
	NET:"NetNode",		//网络等待
	GAME:"GameNode",	//游戏层
};

Define.LayerBaseZOrder = {
	UI_Z : 1,
	WND_Z : 100,
	NET_Z : 1000,
	MSG_Z : 2000,
};

Define.LayerWndDepth = 60;