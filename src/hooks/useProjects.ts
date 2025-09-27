import { useState, useEffect, useCallback } from 'react';
import { Project, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'projects_data';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Project[]>(CACHE_KEY);
        if (cachedData) {
          setProjects(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 1000ms to 150ms
      
      const mockProjects: Project[] = [
        { 
          id: '1', 
          user_id: 'user-123', 
          name: 'Website Redesign Client A', 
          description: 'Redesign website untuk client A',
          client_id: '1',
          start_date: '2023-01-15',
          end_date: '2023-03-15',
          budget: 10000000,
          status: 'active',
          created_at: '2023-01-10'
        },
        { 
          id: '2', 
          user_id: 'user-123', 
          name: 'Logo Design untuk Startup B', 
          description: 'Mendesain logo untuk startup baru',
          client_id: '2',
          start_date: '2023-02-01',
          end_date: '2023-02-20',
          status: 'completed',
          created_at: '2023-01-20'
        },
        { 
          id: '3', 
          user_id: 'user-123', 
          name: 'E-commerce Platform', 
          description: 'Membangun platform e-commerce',
          client_id: '3',
          start_date: '2023-03-01',
          budget: 50000000,
          status: 'planning',
          created_at: '2023-02-15'
        }
      ];
      
      setProjects(mockProjects);
      // Cache the data for 5 minutes
      globalCache.set<Project[]>(CACHE_KEY, mockProjects, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      // Ensure user_id is included in the project data
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        user_id: projectData.user_id || 'user-123' // Use provided user_id or default
      };
      
      setProjects(prev => [newProject, ...prev]);
      // Update cache
      globalCache.set<Project[]>(CACHE_KEY, [newProject, ...projects], 5 * 60 * 1000);
      return newProject;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setProjects(prev => {
        const updated = prev.map(project => project.id === id ? { ...project, ...projectData } : project);
        // Update cache
        globalCache.set<Project[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...projectData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setProjects(prev => {
        const filtered = prev.filter(project => project.id !== id);
        // Update cache
        globalCache.set<Project[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
        return filtered;
      });
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
}