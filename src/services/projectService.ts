import { INITIAL_PROJECTS } from '../data/constants';
import type { Project } from '../data/types';

/**
 * Adapter for Project data management.
 * Currently uses local state/constants, but prepared for Supabase/Firebase integration.
 */
class ProjectService {
    private projects: Project[] = [...INITIAL_PROJECTS];

    async getProjects(): Promise<Project[]> {
        // Simulate API fetch
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.projects), 500);
        });
    }

    async addProject(project: Project): Promise<Project> {
        // Simulate API post
        return new Promise((resolve) => {
            setTimeout(() => {
                this.projects = [project, ...this.projects];
                resolve(project);
            }, 800);
        });
    }

    async deleteProject(id: number): Promise<void> {
        // Simulate API delete
        return new Promise((resolve) => {
            setTimeout(() => {
                this.projects = this.projects.filter(p => p.id !== id);
                resolve();
            }, 500);
        });
    }
}

export const projectService = new ProjectService();
