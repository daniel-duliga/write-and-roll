export class EventUtil {
    static stopEvent(e: Event) {
        e.stopPropagation();
        e.preventDefault();
    }
}