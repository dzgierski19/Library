import { ItemList } from "./ItemList";
import { User, userId } from "./User";

export class UserList extends ItemList<userId, User> {
  constructor() {
    super("User");
  }
}
