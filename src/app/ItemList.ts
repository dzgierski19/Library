export class ItemList<T, U> {
  list: Map<T, U> = new Map();

  constructor(private readonly itemType = "Book" || "User") {}

  addOne(itemId: T, item: U): void {
    this.list.set(itemId, item);
  }

  deleteOne(itemId: T): void {
    this.isItemAvailable(itemId);
    this.list.delete(itemId);
  }

  getOne(itemId: T): U {
    this.isItemAvailable(itemId);
    return this.list.get(itemId);
  }

  protected isItemAvailable(itemId: T): void {
    if (!this.list.has(itemId)) {
      throw new Error(`${this.itemType} is not available`);
    }
  }
}
