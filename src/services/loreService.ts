import type { Identity } from '../data/types';

/**
 * Service for handling identity-based lore and analysis.
 */
class LoreService {
    private readonly loreBank: Record<Identity, string> = {
        Marc: "The mission is paramount. This relic is a tactical asset.",
        Steven: "Remarkable! This data structure predates modern civilization.",
        Jake: "I've seen enough. This one stays with me."
    };

    async getProjectLore(identity: Identity, _projectId: number): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.loreBank[identity]);
            }, 1200);
        });
    }
}

export const loreService = new LoreService();
