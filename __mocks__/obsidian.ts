import { vi } from 'vitest';

export class Plugin {
	app: any;
	manifest: any;
	constructor() {
		this.app = {};
		this.manifest = {};
	}
	addCommand() {}
	addRibbonIcon() {}
	addSettingTab() {}
	loadData() { return Promise.resolve({}); }
	saveData() { return Promise.resolve(); }
	registerView() {}
}

export class PluginSettingTab {
	app: any;
	plugin: any;
	containerEl: any;
	constructor(app: any, plugin: any) {
		this.app = app;
		this.plugin = plugin;
		this.containerEl = { createEl: vi.fn(), empty: vi.fn() };
	}
	display() {}
	hide() {}
}

export class ItemView {
	app: any;
	leaf: any;
	containerEl: any = { createEl: vi.fn(), empty: vi.fn() };
	constructor() {
		this.app = {};
		this.leaf = {};
	}
	getViewType() { return 'test-view'; }
	getDisplayText() { return 'Test View'; }
	onOpen() { return Promise.resolve(); }
	onClose() { return Promise.resolve(); }
}

export class Modal {
	app: any;
	containerEl: any;
	titleEl: any;
	contentEl: any;
	constructor(app: any) {
		this.app = app;
		this.containerEl = { createEl: vi.fn(), empty: vi.fn() };
		this.titleEl = { createEl: vi.fn(), empty: vi.fn() };
		this.contentEl = { createEl: vi.fn(), empty: vi.fn() };
	}
	open() {}
	close() {}
}

export class Notice {
	constructor(message: string) {}
	hide() {}
}

export class TFile {
	path: string = '';
	name: string = '';
	basename: string = '';
	extension: string = '';
	stat: { ctime: number; mtime: number; size: number } = { ctime: Date.now(), mtime: Date.now(), size: 0 };
	parent: any = null;
	vault: any;
}

export class TFolder {
	path: string = '';
	name: string = '';
	children: any[] = [];
	parent: any = null;
	vault: any;
}

export interface TAbstractFile {
	vault: any;
	path: string;
	name: string;
	parent: TFolder | null;
}

export function normalizePath(path: string): string {
	return path.replace(/\\/g, '/');
}

export const requestUrl = vi.fn(() => Promise.resolve({
	status: 200,
	text: '',
	json: {},
	arrayBuffer: new ArrayBuffer(0),
	headers: {}
}));

export const setIcon = vi.fn();

export class Vault {
	adapter: any;

	constructor() {
		this.adapter = {
			exists: vi.fn(() => Promise.resolve(false)),
			read: vi.fn(() => Promise.resolve('')),
			write: vi.fn(() => Promise.resolve()),
			remove: vi.fn(() => Promise.resolve()),
			mkdir: vi.fn(() => Promise.resolve())
		};
	}

	getMarkdownFiles() { return []; }
	getAbstractFileByPath() { return null; }
	create() { return Promise.resolve(); }
	modify() { return Promise.resolve(); }
	process() { return Promise.resolve(); }
	read() { return Promise.resolve(''); }
	cachedRead() { return Promise.resolve(''); }
	delete() { return Promise.resolve(); }
	rename() { return Promise.resolve(); }
	createFolder() { return Promise.resolve(); }
}

export class FileManager {
	renameFile = vi.fn(() => Promise.resolve());
}

export class WorkspaceLeaf {
	view: any;
	getViewState() { return {}; }
	setViewState() { return Promise.resolve(); }
}

export class Setting {
	settingEl: any;

	constructor(containerEl: any) {
		this.settingEl = { createEl: vi.fn(), empty: vi.fn() };
	}

	setName() { return this; }
	setDesc() { return this; }
	addText() { return this; }
	addToggle() { return this; }
	addDropdown() { return this; }
	addButton() { return this; }
	addTextArea() { return this; }
	addSlider() { return this; }
	then() { return this; }
}
