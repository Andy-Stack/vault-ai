import type { IListItem } from './ConversationHistoryModal';

export function createConversationHistoryState() {
    const state = $state({
        items: [] as IListItem[],
        loading: true
    });
    return state;
}