/**
 * @name QuestCompleterHotkey
 * @author rhaegorik
 * @description Запускает скрипт discord-quest-completer по нажатию Ctrl+Shift+Q.
 * @version 1.0.0
 */

module.exports = class QuestCompleterHotkey {
    constructor() {
        this.pluginName = "QuestCompleterHotkey";
        this.Api = new BdApi(this.pluginName);
        this.hotkeyHandler = null;
    }

    start() {
        this.Api.Logger.info("Плагин запущен. Нажмите Ctrl+Shift+Q для запуска.");
        
        this.hotkeyHandler = (e) => {
            // Ctrl+Shift+Q (event.code не зависит от раскладки)
            if (e.ctrlKey && e.shiftKey && e.code === "KeyQ") {
                e.preventDefault();
                e.stopPropagation();
                this.runQuestCompleter();
            }
        };
        
        document.addEventListener("keydown", this.hotkeyHandler, true);
    }

    stop() {
        if (this.hotkeyHandler) {
            document.removeEventListener("keydown", this.hotkeyHandler, true);
        }
        this.Api.Logger.info("Плагин остановлен.");
    }

    async runQuestCompleter() {
        const url = "https://raw.githubusercontent.com/nyxxbit/discord-quest-completer/main/index.js";
        
        BdApi.UI.showToast("Загрузка скрипта...", { type: "info", timeout: 2000 });
        
        try {
            const response = await BdApi.Net.fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const code = await response.text();
            
            // Выполняем код в глобальном контексте, как если бы он был вставлен в консоль
            // Используем eval, чтобы сохранить область видимости window
            eval(code);
            
            BdApi.UI.showToast("Скрипт успешно запущен!", { type: "success", timeout: 3000 });
            this.Api.Logger.info("Скрипт discord-quest-completer выполнен.");
            
        } catch (error) {
            BdApi.UI.showToast(`Ошибка: ${error.message}`, { type: "error", timeout: 5000 });
            this.Api.Logger.error("Не удалось загрузить или выполнить скрипт:", error);
        }
    }

    getSettingsPanel() {
        return "Плагин для запуска скрипта discord-quest-completer. Нажмите Ctrl+Shift+Q.";
    }
};