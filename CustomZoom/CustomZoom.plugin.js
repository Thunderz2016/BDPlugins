/**
 * @name CustomZoom
 * @author Thunderz2016
 * @description Overrides the zoom level with an arbitrary percentage.
 * @version 0.0.1
 * @authorLink https://github.com/thunderz2016
 */

const defaults = {
    zoomLevel: 100,
    allowUnsafeZoom: false,
};

module.exports = class CustomZoom {
    constructor(meta) {
        this.meta = meta;
        this.settings = Object.assign(
            {},
            defaults,
            BdApi.Data.load("CustomZoom", "settings")
        );
        this.config = {
            settings: [
                {
                    type: "number",
                    id: "zoom-level",
                    name: "Zoom Level",
                    note: "Enter a zoom level in percentage. Applies automatically.",
                    value: this.settings.zoomLevel,
                    min: 50,
                    max: 200,
                    step: 5,
                },
                {
                    type: "switch",
                    id: "allow-unsafe-zoom",
                    name: "Allow Unsafe Zoom Levels",
                    note: "If enabled, zoom levels smaller than 50% and greater than 200% will be applied.",
                    value: this.settings.allowUnsafeZoom,
                },
            ],
        };
    }

    start() {
        document.body.style.zoom = `${this.settings.zoomLevel}%`;
    }

    stop() {
        document.body.style.zoom = "100%";
    }

    getSettingsPanel() {
        // console.log("CustomZoom zoom level: " + this.settings.zoomLevel);
        this.config.settings[0].value = this.settings.zoomLevel;
        this.config.settings[1].value = this.settings.allowUnsafeZoom;

        return BdApi.UI.buildSettingsPanel({
            settings: this.config.settings,
            onChange: (_, id, value) => {
                if (id === "zoom-level") {
                    if (!this.settings.allowUnsafeZoom && (value < this.config.settings[0].min || value > this.config.settings[0].max)) {
                        return;
                    }
                    document.body.style.zoom = `${value}%`;
                    this.settings.zoomLevel = value;
                    BdApi.Data.save("CustomZoom", "settings", this.settings);
                } else if (id === 'allow-unsafe-zoom') {
                    this.settings.allowUnsafeZoom = value;
                    BdApi.Data.save("CustomZoom", "settings", this.settings);
                }
            },
        });
    }
};
