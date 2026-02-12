import { supabase } from './supabase';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { mapItemFromDb, mapDeptFromDb, mapOwnerFromDb } from './mappers';
import type { RealtimeChannel } from '@supabase/supabase-js';

let channel: RealtimeChannel | null = null;

export async function initializeData() {
  const store = useRoadmapStore.getState();
  store.setLoading(true);

  try {
    const [itemsRes, deptsRes, ownersRes, feedbackRes] = await Promise.all([
      supabase.from('roadmap_items').select('*').order('created_at'),
      supabase.from('departments').select('*').order('sort_order'),
      supabase.from('owners').select('*').order('sort_order'),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]);

    if (itemsRes.error) throw itemsRes.error;
    if (deptsRes.error) throw deptsRes.error;
    if (ownersRes.error) throw ownersRes.error;

    store.setItems((itemsRes.data ?? []).map(mapItemFromDb));
    store.setDepartments((deptsRes.data ?? []).map(mapDeptFromDb));
    store.setOwners((ownersRes.data ?? []).map(mapOwnerFromDb));
    store.setFeedbackItems(feedbackRes.data ?? []);
  } catch (err: any) {
    store.setError(`Failed to load data: ${err.message}`);
  } finally {
    store.setLoading(false);
  }
}

export function subscribeToChanges() {
  if (channel) return;

  channel = supabase
    .channel('roadmap-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap_items' },
      (payload) => {
        const store = useRoadmapStore.getState();
        if (payload.eventType === 'INSERT') {
          const newItem = mapItemFromDb(payload.new as any);
          // Upsert: remove optimistic version (if any) + add server-confirmed
          store.setItems([
            ...store.items.filter((i) => i.id !== newItem.id),
            newItem,
          ]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapItemFromDb(payload.new as any);
          store.setItems(store.items.map((i) => i.id === updated.id ? updated : i));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any).id;
          store.setItems(store.items.filter((i) => i.id !== oldId));
        }
      }
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' },
      (payload) => {
        const store = useRoadmapStore.getState();
        if (payload.eventType === 'INSERT') {
          const dept = mapDeptFromDb(payload.new as any);
          store.setDepartments([
            ...store.departments.filter((d) => d.key !== dept.key),
            dept,
          ]);
        } else if (payload.eventType === 'UPDATE') {
          const dept = mapDeptFromDb(payload.new as any);
          store.setDepartments(store.departments.map((d) => d.key === dept.key ? dept : d));
        } else if (payload.eventType === 'DELETE') {
          const oldKey = (payload.old as any).key;
          store.setDepartments(store.departments.filter((d) => d.key !== oldKey));
        }
      }
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'owners' },
      (payload) => {
        const store = useRoadmapStore.getState();
        if (payload.eventType === 'INSERT') {
          const owner = mapOwnerFromDb(payload.new as any);
          store.setOwners([
            ...store.owners.filter((o) => o.key !== owner.key),
            owner,
          ]);
        } else if (payload.eventType === 'UPDATE') {
          const owner = mapOwnerFromDb(payload.new as any);
          store.setOwners(store.owners.map((o) => o.key === owner.key ? owner : o));
        } else if (payload.eventType === 'DELETE') {
          const oldKey = (payload.old as any).key;
          store.setOwners(store.owners.filter((o) => o.key !== oldKey));
        }
      }
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' },
      (payload) => {
        const store = useRoadmapStore.getState();
        if (payload.eventType === 'INSERT') {
          const fb = payload.new as any;
          store.setFeedbackItems([
            fb,
            ...store.feedbackItems.filter((f) => f.id !== fb.id),
          ]);
        } else if (payload.eventType === 'UPDATE') {
          const fb = payload.new as any;
          store.setFeedbackItems(store.feedbackItems.map((f) => f.id === fb.id ? fb : f));
        } else if (payload.eventType === 'DELETE') {
          const oldId = (payload.old as any).id;
          store.setFeedbackItems(store.feedbackItems.filter((f) => f.id !== oldId));
        }
      }
    )
    .subscribe();
}

export function unsubscribeFromChanges() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}
