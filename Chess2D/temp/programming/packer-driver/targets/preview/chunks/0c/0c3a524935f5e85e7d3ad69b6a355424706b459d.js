System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, TelegramManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "72ba0FzPE1Ah5W0xcuKayn6", "TelegramManager", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass
      } = _decorator);

      _export("TelegramManager", TelegramManager = (_dec = ccclass('TelegramManager'), _dec(_class = class TelegramManager extends Component {
        onLoad() {
          this.loadTelegramSDK();
        }

        loadTelegramSDK() {
          var _Telegram;

          if ((_Telegram = window.Telegram) != null && _Telegram.WebApp) {
            this.initTelegram();
            return;
          }

          var script = document.createElement('script');
          script.src = 'https://telegram.org/js/telegram-web-app.js';
          script.async = true;

          script.onload = () => this.initTelegram();

          document.head.appendChild(script);
        }

        initTelegram() {
          var _Telegram2;

          var tg = (_Telegram2 = window.Telegram) == null ? void 0 : _Telegram2.WebApp;

          if (tg) {
            var _tg$initDataUnsafe;

            tg.ready();
            tg.expand();
            tg.disableVerticalSwipes == null || tg.disableVerticalSwipes();
            var user = (_tg$initDataUnsafe = tg.initDataUnsafe) == null ? void 0 : _tg$initDataUnsafe.user;
            console.log("Telegram Game Loaded for: " + ((user == null ? void 0 : user.first_name) || 'Guest'));
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0c3a524935f5e85e7d3ad69b6a355424706b459d.js.map