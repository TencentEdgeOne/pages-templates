<br />
<p align="center">
<img src="https://github.com/iAJue/MoeKoeMusic/raw/main/images/logo.png " alt="Logo" width="156" height="156">
<h2 align="center" style="font-weight: 600">MoeKoe Music</h2>

<p align="center">
An open-source, concise, and aesthetically pleasing third-party client for KuGou
<br />
<a href="https://github.com/iAJue/MoeKoeMusic/" target="blank"><strong>🌎 GitHub Repository</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="https://github.com/iAJue/MoeKoeMusic/releases" target="blank"><strong>📦️ Download Packages</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="https://MoeJue.cn" target="blank"><strong>💬 Visit Blog</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="https://Music.MoeKoe.cn" target="blank"><strong>🏠 Project Homepage</strong></a>

</p>
<p align="center">
    <a href="https://github.com/iAJue/MoeKoeMusic/README.md" target="blank"><strong>🇨🇳 简体中文</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="https://github.com/iAJue/MoeKoeMusic/blob/main/docs/README_tw.md" target="blank"><strong>🇨🇳 繁体中文</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="https://github.com/iAJue/MoeKoeMusic/blob/main/docs/README_ja.md" target="blank"><strong>🇯🇵 日本語</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="https://github.com/iAJue/MoeKoeMusic/blob/main/docs/README_en.md" target="blank"><strong>🇺🇸 English</strong></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="https://github.com/iAJue/MoeKoeMusic/blob/main/docs/README_ko.md" target="blank"><strong>🇰🇷 한국어</strong></a>
    <br />
    <br />
  </p>
</p>

![images]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/5.png )

## ❤️ Preface

As early as around 10 years ago, when I was using the web version of QQ, I had already started using Kugou Music (which I have been a fan of for over ten years), so all the songs I collected over the years were on it Later on, I also tried using NetEase Cloud or QQ Music, and tried importing Kugou's playlists into it, but the results were not satisfactory I mostly listen to Japanese anime OP, and I can't find many songs

After wandering around, I finally returned to Kugou. However, on the Mac version of Kugou, there may often be situations where it cannot be played. Although the interface does not have many functions, it is still quite good With the support of netizens, I have been working on [Kugou's concept version](https://t1.kugou.com/d2tBza3CSV2)Listen to music online, and it is one of the few music playback software on the market that allows you to listen to VIP songs for free. It is highly recommended

I said on my personal introduction page that I particularly enjoy listening to music, especially Japanese anime OP How can we prove it? (My web version of the playlist was also in disrepair for a long time before) So I'll develop my own music player


##  ✨  characteristic

-  ✅  Developing with Vue.js Family Bucket
-  🔴  KuGou account login (scan code/phone/account login)
-  📃  Support lyric display
-  📻  Daily recommended songs
-  🚫🤝  No social function
-  🔗  Official server direct connection, without any third-party APIs
-  ✔️  Automatically claim VIP every day, log in to become VIP
-  🎨  Theme color switching
-  👋  Initiate greetings
-  ⚙️  Multi platform support
-  🛠  More features under development

## 📢 Todo List
- [ ]  📺  Support MV playback
- [x]  🌚 Light/Dark Mode  Automatic switching
- [ ]  👆  Support Touch Bar
- [ ]  🖥️  Support PWA, you can click on the right side of the address bar in Chrome/Edge ➕  Install to computer
- [ ]  🟥  Supports Last.fm Scrobble
- [ ]  🎧  Support Mpris
- [x]  ⌨️   Global shortcut keys
- [x]  🤟  Multi language support
- [x]  📻  Desktop Lyrics
- [x]  ⚙️  System architecture optimization
- [x]  🎶  Songs, playlists/favorites, cancellation

Please check the  for the update log [Commits](https://github.com/iAJue/MoeKoeMusic/commits/main/)

##  📦 Installation

Accessing for this project [Release](https://github.com/iAJue/MoeKoeMusic/releases)Download the installation package from the page.

##  ⚙️  development

1. Clone this repository

```sh
git clone  https://github.com/iAJue/MoeKoeMusic.git
```

2. Enter the directory and install dependencies

```sh
cd MoeKoeMusic
npm run install-all
```
3. Launch developer mode
```sh
npm run dev
```
4. Package project
```sh
npm run build
```
5. Compile the project
- Windows: 
```sh
Npm run electron: build: win [default NSIS installation package]
```
-	Linux: 
```sh
Npm run electron: build: Linux [default AppImage format]
```
-	macOS: 
```sh
Npm run electron: build: macos [default universal architecture]
```


For more commands, please refer to the ` package.json ` file ` scripts `

##  👷‍♂️  Compile client

If you cannot find the installation package suitable for your device on the Release page, you can follow the steps below to package your own client.

1. Install [Node.js](https://nodejs.org/en/)And ensure that the 'Node. js' version is>=18.0.0.

2. Use ` git clone https://github.com/iAJue/MoeKoeMusic.git `Clone this repository locally.

3. Use 'npm install' to install project dependencies.
4. Compile API server
- Windows:
```sh
npm run build:api:win
```
- Linux:
```sh
npm run build:api:linux
```
- macOS:
```sh
npm run build:api:macos
```

5. Choose the following command to package the appropriate installation package for you, and the packaged file should be located in the '/dits_electron' directory. For more information, please visit the [Electron Builder documentation](https://www.electron.build/cli )


#### 1.  Package macOS platform
- Universal macOS package (Intel and Apple Silicon dual architecture):
```
npm run electron:build -- --mac --universal
```
- Only Intel architecture:
```
npm run electron:build -- --mac --x64
```
- Only Apple Silicon architecture:
```
npm run electron:build -- --mac --arm64
```


#### 2.  Package Windows Platform

- Default NSIS installation package (suitable for most Windows users):
```
npm run electron:build -- --win
```
- Create EXE files and Squirrel installation packages for Windows:
```
npm run electron:build -- --win --ia32 --x64 --arm64 --target squirrel
```
  - Ia32 is a 32-bit Windows architecture.
  - X64 is a 64 bit Windows architecture.
  - Arm64 is based on ARM Windows architecture (for devices such as Surface).

- Generate portable EXE files for Windows (installation free):
```
npm run electron:build -- --win --portable
```
#### 3.  Packaging Linux Platform
- Default AppImage format (applicable to most Linux distributions):
```
npm run electron:build -- --linux
```
- Snap (for Ubuntu and Snap supported distributions):
```
npm run electron:build -- --linux --target snap
```
- Deb (applicable to the Debian/Ubuntu series):
```
npm run electron:build -- --linux --target deb
```
- RPM (applicable to Red Hat/Fedora series):
```
npm run electron:build -- --linux --target rpm
```

#### 4.  Package all platforms

If you need to generate installation packages for Windows, macOS, and Linux simultaneously, you can use the following command:
```
npm run electron:build -- -mwl
```

#### 5.  Custom compilation settings

You can add other options as needed to further customize the packaging, such as specifying x64 and arm64 architectures, or selecting different target formats.

## ⭐ Support This Project

If you find this project helpful, please consider giving us a star! Your support motivates us to keep improving.

[![GitHub stars](https://img.shields.io/github/stars/iAJue/MoeKoeMusic.svg?style=social&label=Star)](https://github.com/iAJue/MoeKoeMusic)

##  ☑️  feedback

If you have any questions or suggestions, please feel free to submit an issue or pull request.

## ⚠️ Disclaimers
0. This program is a third-party client of KuGou, not an official KuGou client. If you need more complete functions, please download the official client to experience it
1. This project is for learning purposes only. Please respect copyright and do not use this project for commercial activities or illegal purposes!
2. Copyright data may be generated during the use of this project. For these copyrighted data, this project does not own them. To avoid infringement, users must clear any copyright data generated during the use of this project within 24 hours.
3. The user shall be responsible for any direct, indirect, special, incidental, or consequential damages of any nature arising from the use of this project, including but not limited to damages caused by loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses.
            
1. It is prohibited to use this project in violation of local laws and regulations. Any illegal or irregular behavior caused by the use of this project by users who are aware or unaware that local laws and regulations do not allow it shall be borne by the users, and this project shall not be held responsible for any direct, indirect, special, incidental or consequential liability arising therefrom.
            
2. Music platforms are not easy, please respect copyright and support genuine versions.
3. This project is only for the exploration and research of technical feasibility, and does not accept any commercial (including but not limited to advertising, etc.) cooperation or donations.
If the official music platform finds this project inappropriate, they can contact this project to make changes or remove it.
            

##  📜  Open source license

This project is for personal learning and research purposes only, and is prohibited from being used for commercial or illegal purposes.

Based on [MIT license](https://opensource.org/licenses/MIT)License to open source.

## 👍 Inspiration source

The API source code comes from [MakcRe/KuGouMusicApi](https://github.com/MakcRe/KuGouMusicApi ) 
In order to avoid disrupting the structure of the original project and facilitate later updates and iterations, the API has not been highly integrated~~ Actually, it's to save time~~)

- [Apple Music]( https://music.apple.com )
- [YouTube Music]( https://music.youtube.com )
- [YesPlayMusic]( https://github.com/qier222/YesPlayMusic )
-[Cool Dog Music](https://kugou.com/ )

##  🖼️  screenshot

![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/1.png )
![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/2.png )
![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/3.png )
![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/4.png )
![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/5.png )
![image]( https://github.com/iAJue/MoeKoeMusic/raw/main/images/6.png )


## 🗓️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=iAJue/MoeKoeMusic&type=Date)](https://www.star-history.com/#iAJue/MoeKoeMusic&Date)
