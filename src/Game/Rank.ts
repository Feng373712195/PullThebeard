class Rank extends eui.Group {
    constructor(stageW:number,stageH:number) {
        super();

        const mask:egret.Sprite = new egret.Sprite();
        mask.zIndex = 999;
        mask.graphics.beginFill(0x000000,0.4);
        mask.graphics.drawRect(0,0,stageW,stageH);
        mask.graphics.endFill();

        this.addChild(mask);
    }
    private list:eui.List;
    protected createChildren() {
        super.createChildren();
        var group = new eui.Group();
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 200;
        myScroller.height = 200;
        myScroller.viewport = group;

        var exml = `<e:Skin xmlns:e="http://ns.egret.com/eui" states="up,down" height="50"> <e:Label text="{data}" textColor.down="0xFFFFFF" textColor.up="0x666666" horizontalCenter="0" verticalCenter="0"/> </e:Skin>`;
        var list = new eui.List();
        list.dataProvider = new eui.ArrayCollection(["item1","item2","item3","item1","item2","item3","item1","item2","item3","item1","item2","item3"]);
        list.itemRendererSkinName = exml;
        group.addChild(list);

        this.list = list;
        this.addChild(myScroller);
    }
}