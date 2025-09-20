!include "MUI.nsh"
!define MUI_FINISHPAGE_LINK_LOCATION "https://MoeJue.cn"
!define MUI_FINISHPAGE_LINK "访问作者(阿珏酱)主页"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "访问 GitHub 项目主页"
!define MUI_FINISHPAGE_SHOWREADME "https://github.com/iAJue/MoeKoeMusic"
!insertmacro MUI_PAGE_WELCOME

; Register the moekoe:// protocol
!macro customInstall
  DeleteRegKey HKCR "moekoe"
  WriteRegStr HKCR "moekoe" "" "URL:MoeKoe Music Protocol"
  WriteRegStr HKCR "moekoe" "URL Protocol" ""
  WriteRegStr HKCR "moekoe\DefaultIcon" "" "$INSTDIR\${PRODUCT_NAME}.exe,0"
  WriteRegStr HKCR "moekoe\shell" "" ""
  WriteRegStr HKCR "moekoe\shell\open" "" ""
  WriteRegStr HKCR "moekoe\shell\open\command" "" '"$INSTDIR\${PRODUCT_NAME}.exe" "%1"'
!macroend