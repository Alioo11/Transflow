import { IEventManager } from "../../types/eventManager";

class EventManager<T> implements IEventManager<T> {
  private _events = new Map<keyof T, Array<(data: unknown) => void>>();
  on: IEventManager<T>["on"] = (eventType, cb) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, cb as (data: unknown) => void]);
  };
  emit: IEventManager<T>["emit"] = (eventType, data) => {
    const events = this._events.get(eventType) || [];
    events.forEach((cb) => cb(data));
  };
}

export default EventManager;
