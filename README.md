# CamSafetyKids — Live Camera

A consent-based live camera prototype for a parent/child safety workflow.

- Child must press **Start camera**.
- Browser/Android permission is required.
- The child page shows a visible **Camera is ON** indicator.
- Parent receives the WebRTC stream after the child starts it.
- No hidden recording, credential collection, or stealth capture.

## One-command Termux start
From the project directory:

`bash start.sh`

If you publish this as a Git repository, the intended short setup is:

`git clone https://github.com/vanshsingh-16/CameraSafetyKids-LiveCamera && cd CamSafetyKids-LiveCamera && bash start.sh`

If `cloudflared` is installed, `start.sh` will automatically start a temporary HTTPS tunnel. Otherwise it starts only on localhost.
