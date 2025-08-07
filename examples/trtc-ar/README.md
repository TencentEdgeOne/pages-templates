# Web Beauty Template

This template supports Tencent's Web Beauty Filters, allowing you to experience various beauty effects.

## Deploy to EdgeOne Pages

### 1. Deploy to Edgeone Pages and get the project preview link address

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=trtc-ar)

![1751509234860](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751509234860.png)

You can copy the project domain in the project list
![1751460123642](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751509721263.png)

Or copy the project domain name in the project overview![1751460335291](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751509962460.png)

**Be careful not to use the preview address domain of the deployment record. Each time you redeploy, a new deployment record will be generated and bound to a new domain. The domain of each deployment record is different, and the preview address of the project is fixed. You can view the latest deployment results by visiting the preview address of the project.**

### 2. Create a license，Getting App ID,License Key and Licene Token

Reference Documentation ：[Getting Web Beauty LIcense](https://trtc.io/document/68777?platform=web&product=beautyar)

1. **Create a license**
   Log in to [TRTC Console &gt; Beauty AR](https://console.trtc.io/beauty/license), and click **Create Trial License**
   ![1751511152451](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751511152451.png)Select Web&H5, and fill in the Project Name and Domain obtained in the first step. Once completed, click Confirm.
2. **Getting App ID, License Key and License Token**
   Getting the App ID, License Key and License Token from [License Management](https://console.trtc.io/beauty/license).
   ![1751512822090](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751512822090.png)
   **Web Domain:** The domain information entered during project creation. The license can be used only under this domain or development environment.

### 3. Set environment variables and redeploy

1. Add environment variables in Edgeone Pages console **Project Settings/Environment Variables**

   ```
   NEXT_PUBLIC_APPID = 'your App ID'
   NEXT_PUBLIC_LICENSE_KEY = 'your License Key'
   NEXT_PUBLIC_LICENSE_TOKEN = 'your License Token'
   ```

   ![1751515079485](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751515079485.png)
   **2. After redeployment, visit the project preview link again
   ![1751515186301.png](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751515186301.png)**

## Local Development

### Project Setup

```sh
npm install
```

### Setting Environment Variables

#### 1. Get environment variables

[Getting Web Beauty LIcense](https://trtc.io/document/68777?platform=web&product=beautyar)

#### 2. Create .env.local

![1751442977073](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751442977073.png)

#### 3. Write environment variables in .env.local:

```
NEXT_PUBLIC_APPID = 'your App ID'
NEXT_PUBLIC_LICENSE_KEY = 'your License Key'
NEXT_PUBLIC_LICENSE_TOKEN = 'your License Token'
```

### Compile and Minify for Production

```sh
npm run build
```
