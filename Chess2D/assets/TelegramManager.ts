import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('TelegramManager')
export class TelegramManager extends Component {
    onLoad() {
        this.loadTelegramSDK();
    }

    private loadTelegramSDK() {
        if ((window as any).Telegram?.WebApp) {
            this.initTelegram();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.onload = () => this.initTelegram();
        document.head.appendChild(script);
    }

    private initTelegram() {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.disableVerticalSwipes?.();
            
            const user = tg.initDataUnsafe?.user;
            console.log(`Telegram Game Loaded for: ${user?.first_name || 'Guest'}`);
        }
    }
}