import { useCallback } from 'react';
import { useStream } from '../context/StreamContext.jsx';

const API_BASE = 'http://localhost:5000/api';

export const useStreamAPI = () => {
  const { state, actions } = useStream();

  const fetchOverlays = useCallback(async () => {
    try {
      actions.setLoading(true);
      const res = await fetch(`${API_BASE}/overlays`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      actions.setOverlays(data);
    } catch (err) {
      console.error('Error fetching overlays:', err);
      actions.setError('Failed to fetch overlays');
      actions.setOverlays([]);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const createOverlay = useCallback(async (overlayData) => {
    try {
      actions.setLoading(true);
      const res = await fetch(`${API_BASE}/overlays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlayData)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      actions.addOverlay(data);
      return data;
    } catch (err) {
      console.error('Error creating overlay:', err);
      actions.setError('Failed to create overlay');
      throw err;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const updateOverlay = useCallback(async (id, overlayData) => {
    try {
      actions.setLoading(true);
      const res = await fetch(`${API_BASE}/overlays/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlayData)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      actions.updateOverlay(data);
      return data;
    } catch (err) {
      console.error('Error updating overlay:', err);
      actions.setError('Failed to update overlay');
      throw err;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const deleteOverlay = useCallback(async (id) => {
    try {
      actions.setLoading(true);
      const res = await fetch(`${API_BASE}/overlays/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      actions.deleteOverlay(id);
    } catch (err) {
      console.error('Error deleting overlay:', err);
      actions.setError('Failed to delete overlay');
      throw err;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  return {
    fetchOverlays,
    createOverlay,
    updateOverlay,
    deleteOverlay
  };
};