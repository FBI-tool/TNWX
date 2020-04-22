import { Application, IBoot } from 'egg';
import { ApiConfig, ApiConfigKit, QyApiConfigKit } from 'tnwx';
/**
 * 参考 https://eggjs.org/zh-cn/basics/app-start.html
 */
export default class FooBoot implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    // 例如：参数中的密码是加密的，在此处进行解密
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    // 例如：创建自定义应用的示例
    // Config, plugin files have loaded.
    this.app.logger.info('configDidLoad...');
  }

  async didLoad() {
    // All files have loaded, start plugin here.
    this.app.logger.info('didLoad...');
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存

    // All plugins have started, can do some thing before app ready.
    this.app.logger.info('willReady...');
  }

  async didReady() {
    // 应用已经启动完毕
    // Worker is ready, can do some things
    // don't need to block the app boot.
    this.app.logger.info('didReady...');

    const config = this.app.config;

    // 亦可以读取配置文件
    const devApiConfig = new ApiConfig(
      config.devApiConfig.appId,
      config.devApiConfig.appScrect,
      config.devApiConfig.token,
    );

    const qyApiConfig = new ApiConfig(
      config.qyApiConfig.appId,
      config.qyApiConfig.appScrect,
      config.qyApiConfig.token,
      config.qyApiConfig.encryptMessage,
      config.qyApiConfig.encodingAesKey,
      config.qyApiConfig.corpId,
    );

    // 支持多公众号
    ApiConfigKit.putApiConfig(devApiConfig);
    ApiConfigKit.setCurrentAppId(devApiConfig.getAppId);
    QyApiConfigKit.putApiConfig(qyApiConfig);
    QyApiConfigKit.setCurrentAppId(qyApiConfig.getAppId, qyApiConfig.getCorpId);
    // 开启开发模式,方便调试
    ApiConfigKit.devMode = true;
    QyApiConfigKit.devMode = true;
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // Server is listening.

    this.app.logger.info('serverDidReady...');
  }

  async beforeClose() {
    // Do some thing before app close.
    this.app.logger.info('beforeClose...');
  }
}
