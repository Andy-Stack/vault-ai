import type VaultkeeperAIPlugin from "main";

export function openPluginSettings(plugin: VaultkeeperAIPlugin) {
    // @ts-ignore - accessing internal API
    plugin.app.setting.open();
    // @ts-ignore - accessing internal API
    plugin.app.setting.openTabById(plugin.manifest.id);
}

export function randomSample<T>(array: T[], n: number): T[] {
    const result: T[] = [];
    const taken = new Set<number>();

    while (result.length < n && result.length < array.length) {
        const index = Math.floor(Math.random() * array.length);
        if (!taken.has(index)) {
            taken.add(index);
            result.push(array[index]);
        }
    }

    return result;
}