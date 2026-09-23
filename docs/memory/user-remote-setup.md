---
name: user-remote-setup
description: 저자는 Windows에서 SSH(VS Code Remote)로 Mac에 접속해 작업한다. Mac의 `open`이나 브라우저는 저자 화면에 보이지 않는다
metadata:
  type: user
---

저자는 이 저장소를 Windows PC에서 SSH(VS Code Remote-SSH)로 Mac에 접속해 고칠 때가 있다. 이때 macOS `open`으로 연 파일은 저자 화면에 나타나지 않는다. VS Code의 HTML 미리보기 확장은 페이지 스크립트를 막을 수 있다.

**적용:** 만든 HTML을 보여 줄 때는 폴더를 서버로 띄우고(`python3 -m http.server 8765 --bind 127.0.0.1`) VS Code가 포워딩한 `http://localhost:8765/`나 VS Code의 Simple Browser로 안내한다. 어느 컴퓨터에서 작업 중인지 모르겠으면 묻는다. 관련: `manuscript-html` 스킬 산출물.
