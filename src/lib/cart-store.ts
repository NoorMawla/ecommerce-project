
export type CartItem = {
    productId: string;
    slug: string;
    name: string;
    price: number; 
    imageUrl: string;
    stock: number;
    quantity: number;
  };
  
  export type CartState = {
    items: CartItem[];
    /** false until localStorage has been read on the client */
    ready: boolean;
  };
  
  const STORAGE_KEY = "volt.cart.v1";
  
  /** Stable snapshot used during SSR and hydration. */
  export const SERVER_STATE: CartState = { items: [], ready: false };
  
  let state: CartState = SERVER_STATE;
  const listeners = new Set<() => void>();
  
  function emit(items: CartItem[]) {
    state = { items, ready: true };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable — keep working in memory */
    }
    for (const listener of listeners) listener();
  }
  
  function hydrate() {
    let items: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) items = JSON.parse(raw) as CartItem[];
    } catch {
      /* corrupted storage — start empty */
    }
    state = { items, ready: true };
    for (const listener of listeners) listener();
  }
  
  export function subscribe(listener: () => void) {
    listeners.add(listener);
    if (!state.ready) hydrate();
    return () => listeners.delete(listener);
  }
  
  export function getSnapshot(): CartState {
    return state;
  }
  
  export function getServerSnapshot(): CartState {
    return SERVER_STATE;
  }
  
  export function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    if (item.stock <= 0) return;
    const existing = state.items.find((i) => i.productId === item.productId);
    if (!existing) {
      emit([...state.items, { ...item, quantity: Math.min(quantity, item.stock) }]);
      return;
    }
    emit(
      state.items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
          : i,
      ),
    );
  }
  
  export function setItemQuantity(productId: string, quantity: number) {
    emit(
      state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i,
      ),
    );
  }
  
  export function removeItem(productId: string) {
    emit(state.items.filter((i) => i.productId !== productId));
  }
  
  export function clearCart() {
    emit([]);
  }
  