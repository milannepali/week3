const userItems = [
  {
    user_id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 2,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@metropolia.fi',
    role: 'user',
    password: 'password123',
  },
];

const getAllUsers = () => {
  return userItems;
};

const getUserById = (id) => {
  return userItems.find((user) => user.user_id === Number(id));
};

const addUser = (user) => {
  const newUser = {
    user_id: userItems.length + 1,
    ...user,
  };

  userItems.push(newUser);
  return newUser;
};

export { getAllUsers, getUserById, addUser };
