export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
}
