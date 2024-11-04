import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventItem } from "@/types/event";


export const saveEvent = async (event: EventItem) => {
  try {
    const dateKey = event.startDate.toISOString().split('T')[0];
    const eventKey = `event-${dateKey}-${event.startDate.getTime()}`;
    const jsonValue = JSON.stringify(event);
    await AsyncStorage.setItem(eventKey, jsonValue);
    console.log('Event saved:', event);
  } catch (e) {
    console.error('Failed to save event.', e);
  }
};


export const loadEventsForDate = async (date: string): Promise<EventItem[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const eventKeys = keys.filter(key => key.startsWith(`event-${date}`));
    const eventValues = await AsyncStorage.multiGet(eventKeys);
    const events = eventValues.map(([_, value]) => JSON.parse(value || '{}'));
    console.log('Events loaded for date:', date, events);
    return events;
  } catch (e) {
    console.error('Failed to load events.', e);
    return [];
  }
};


export const updateEvent = async (event: EventItem) => {
  try {
    await saveEvent(event);
  } catch (e) {
    console.error('Failed to update event.', e);
  }
};


export const deleteEvent = async (startDate: Date) => {
  try {
    await AsyncStorage.removeItem(`event-${startDate.toISOString()}`);
  } catch (e) {
    console.error('Failed to delete event.', e);
  }
};
