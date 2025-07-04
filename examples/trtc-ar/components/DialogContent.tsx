import styles from '@/styles/dialog.module.scss';

export const Zh = () => {
  return (
    <>
      <p>
        在本地开发环境，请在<span className={styles.highlight}>.env.local文件中</span>添加以下环境变量：
        <br />
        NEXT_PUBLIC_APPID、NEXT_PUBLIC_LICENSE_TOKEN、NEXT_PUBLIC_LICENSE_KEY
      </p>
      <p>
        使用edgeone pages部署，请在<span className={styles.highlight}>项目设置/环境变量</span>
        新增以下环境变量：NEXT_PUBLIC_APPID、NEXT_PUBLIC_LICENSE_TOKEN、NEXT_PUBLIC_LICENSE_KEY
      </p>
      <p>
        环境变量获取方式：
        <a href="https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/trtc-ar/README_zh-CN.md" target="_blank" rel="noopener noreferrer">
          <span className={`${styles.highlight} ${styles.underline}`}>获取 Web 美颜特效的 License 和 APPID</span>
        </a>
      </p>
    </>
  );
};
export const En = () => {
  return (
    <>
      <p>
        In the local development environment,please add the following environment variables to the{' '}
        <span className={styles.highlight}>.env.local</span> file
        <br />
        NEXT_PUBLIC_APPID、NEXT_PUBLIC_LICENSE_TOKEN、NEXT_PUBLIC_LICENSE_KEY
      </p>
      <p>
        To deploy using edgeone pages, add the following environment variables in{' '}
        <span className={styles.highlight}>Project Settings/Environment Variables</span>:
        <br />
        NEXT_PUBLIC_APPID、NEXT_PUBLIC_LICENSE_TOKEN、NEXT_PUBLIC_LICENSE_KEY
      </p>
      <p>
        How to obtain environment variables:&nbsp;
        <a
          href="https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/trtc-ar/README.md"
          target="_blank"
          rel="noopener noreferrer">
          <span className={`${styles.highlight} ${styles.underline}`}>Getting Web Beauty LIcense</span>
        </a>
      </p>
    </>
  );
};
