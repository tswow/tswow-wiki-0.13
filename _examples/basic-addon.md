---
title: Basic Addon Example
---
```ts
    let mframe = CreateFrame("Frame", "test", UIParent);
    mframe.SetWidth(512);
    mframe.SetHeight(256);
    mframe.SetPoint("CENTER", -100, 0);
    mframe.EnableMouse(true);
    mframe.RegisterForDrag("LeftButton");
    mframe.SetMovable(true);
    mframe.SetScript("OnDragStart", (self) => {
        self.StartMoving();
    });
    mframe.SetScript("OnDragStop", (self) => {
        self.StopMovingOrSizing();
    });
    mframe.SetBackdrop({
        bgFile: "Interface/TutorialFrame/TutorialFrameBackground",
        edgeFile: "Interface/DialogFrame/UI-DialogBox-Border",
        tile: true,
        tileSize: 22,
        edgeSize: 22,
        insets: { left: 4, right: 4, top: 4, bottom: 4 },
    });
    mframe.SetBackdropColor(0, 0, 0, 1);
    mframe.Show()

    let button = CreateFrame('Button','buttonName',mframe)
    button.SetSize(32,32)
    button.SetPoint("TOPLEFT",mframe,"TOPLEFT",0,0)
    button.SetNormalTexture('Interface\\BUTTONS\\UI-Button-KeyRing')
    button.SetPushedTexture('Interface\\BUTTONS\\UI-Button-KeyRing-Down')
    button.SetScript('OnClick',(frame,button,down)=>{
        console.log('clicked me')
    })
    ```
