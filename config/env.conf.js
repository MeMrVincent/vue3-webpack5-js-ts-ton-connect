const envConfig = {
  modules: [],
  process: null,
  argvs: process.argv.slice(2),

  getParams(key) {
    let item = this.argvs.find(item => item.split('=')[0] === key);
    return item ? item.split('=') : [];
  },

  defineModules() {
    class MultiModule {
      constructor(name, opts) {
        Object.assign(this, {
          name,
          host: '0.0.0.0',
          filename: '',
          title: '',
          lanKeys: 'en-us,zh-cn',
          server: 'https',
          receiveCurrency: 'USDT',
        }, opts);
      }
    }

    this.modules = [
      new MultiModule('tgApp', {
        port: 11000,
        filename: 'index.html',
        title: 'Vue Demo For Telegram (Ton Connect)',
        sysApp: 'tgApp',
        sysName: 'tg',
        appVersion: '4.0',
        dev: {
          staticURL: './',
          apiURL: 'https://53eb2148b9.srv.openad.network',
          tonURL: 'https://connect.tonhubapi.com',
          dist: 'dev',
          receiveAddress: '0QBqho3NgfG6GzmbkQOA3VAtIdBvaBfzEjr2HYgf7gLhH10v',
          USDTContract: 'kQAiboDEv_qRrcEdrYdwbVLNOXBHwShFbtKGbQVJ2OKxY_Di',
          TonRPCAddress: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        },
        test: {
          staticURL: './',
          apiURL: 'https://53eb2148b9.srv.openad.network',
          webURL: 'https://tg.jm178.com.cn',
          dist: 'test',
          receiveAddress: '0QBqho3NgfG6GzmbkQOA3VAtIdBvaBfzEjr2HYgf7gLhH10v',
          USDTContract: 'kQAiboDEv_qRrcEdrYdwbVLNOXBHwShFbtKGbQVJ2OKxY_Di',
          TonRPCAddress: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        },
        uat: {
          staticURL: './',
          apiURL: 'https://bf2055756e.srv.openad.network',
          webURL: 'https://bf2055756e.node.openad.network',
          dist: 'uat',
          receiveAddress: 'UQDHOor3ni08vZ50KSfWbG7dQNbwBa40UflaYzWHsctHqc_0',
          USDTContract: 'UQArU2beaKn-m-are1Rv0KMICiX7120_RipdBDrt_IMjPeP2',
          TonRPCAddress: 'https://toncenter.com/api/v2/jsonRPC',
        },
        prod: {
          staticURL: './',
          apiURL: 'https://bf2055756e.srv.openad.network',
          webURL: 'https://bf2055756e.node.openad.network',
          dist: 'prod',
          receiveAddress: 'UQDHOor3ni08vZ50KSfWbG7dQNbwBa40UflaYzWHsctHqc_0',
          USDTContract: 'UQArU2beaKn-m-are1Rv0KMICiX7120_RipdBDrt_IMjPeP2',
          TonRPCAddress: 'https://toncenter.com/api/v2/jsonRPC',
        },
      }),
      new MultiModule('lineApp', {
        port: 12000,
        filename: 'index.html',
        title: 'Vue Demo For Line NEXT (Reown)',
        sysApp: 'lineApp',
        sysName: 'line',
        appVersion: '1.0',
        dev: {
          staticURL: './',
          apiURL: 'https://53eb2148b9.srv.openad.network',
          tonURL: 'https://connect.tonhubapi.com',
          dist: 'dev',
          receiveAddress: '0x419ca4beafcbcb4f106fdaab6dd49dea82eee3cc',
          USDTContract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          TonRPCAddress: '',
        },
        test: {
          staticURL: './',
          apiURL: 'https://53eb2148b9.srv.openad.network',
          webURL: 'https://line.jm178.com.cn',
          dist: 'test',
          receiveAddress: '0x419ca4beafcbcb4f106fdaab6dd49dea82eee3cc',
          USDTContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          TonRPCAddress: '',
        },
        uat: {
          staticURL: './',
          apiURL: 'https://6bf9546ea5.srv.openad.network',
          webURL: 'https://6bf9546ea5.node.openad.network',
          dist: 'uat',
          receiveAddress: '0x419ca4beafcbcb4f106fdaab6dd49dea82eee3cc',
          USDTContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          TonRPCAddress: '',
        },
        prod: {
          staticURL: './',
          apiURL: 'https://6bf9546ea5.srv.openad.network',
          webURL: 'https://6bf9546ea5.node.openad.network',
          dist: 'prod',
          receiveAddress: '0x419ca4beafcbcb4f106fdaab6dd49dea82eee3cc',
          USDTContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          TonRPCAddress: '',
        },
      }),
    ];
  },

  getModuleProcess(name) {
    let mItem = this.modules.find(item => item.name === name);
    return mItem || this.modules[0];
  },

  getNodeENV(obj) {
    return this.getENV('node', obj, this.process);
  },

  getBuildENV(obj) {
    return this.getENV('build', obj, this.process);
  },

  getENV(type, obj, params) {
    let item;
    for (let x in params) {
      item = params[x];
      if (typeof item === 'object' && x === JSON.parse(obj.prod)) {
        this.getENV(type, obj, item);
      }
      if (typeof item !== 'object') {
        if (type === 'node') {
          obj[x] = '"' + item + '"';
        }
        if (type === 'build') {
          obj[x] = item;
        }
      }
    }
    return obj;
  },

  init() {
    this.defineModules();
    let eventName = String(process.env.npm_lifecycle_event).split('-');
    let moduleName = this.getParams('name')[1] || eventName[1];
    this.process = this.getModuleProcess(moduleName);
  },
};

envConfig.init();

module.exports = envConfig;
