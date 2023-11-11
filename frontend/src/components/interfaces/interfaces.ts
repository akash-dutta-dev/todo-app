//Login form interface
interface LoginForm {
    email: string;
    password: string;
}

// TodoList interface
interface TodoList {
    ongoing: TodoItem[];
    todo: TodoItem[];
    done: TodoItem[];
  }

  // TodoItem interface
interface TodoItem {
    id: string;
    title: string;
    description: string;
    userId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

  interface EditForm {
    id: string;
    title: string;
    description: string;
}

  export type { TodoList, TodoItem, EditForm, LoginForm };