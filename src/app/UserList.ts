import { ItemList } from "./ItemList";
import { Megan, User, userId } from "./User";

export class UserList extends ItemList<userId, User> {
  constructor() {
    super("User");
  }
}

const newUserList = new UserList();
