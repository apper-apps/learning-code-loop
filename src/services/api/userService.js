import usersData from "@/services/mockData/users.json";

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async () => {
  await delay(300);
  return users.map(user => ({ ...user }));
};

export const getUserById = async (id) => {
  await delay(200);
  const user = users.find(u => u.Id === parseInt(id));
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  return { ...user };
};

export const createUser = async (userData) => {
  await delay(400);
  const newUser = {
    ...userData,
    Id: Math.max(...users.map(u => u.Id)) + 1,
    is_admin: false,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  return { ...newUser };
};

export const updateUser = async (id, userData) => {
  await delay(350);
  const index = users.findIndex(u => u.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`User with id ${id} not found`);
  }
  users[index] = { ...users[index], ...userData };
  return { ...users[index] };
};

export const deleteUser = async (id) => {
  await delay(250);
  const index = users.findIndex(u => u.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`User with id ${id} not found`);
  }
  users.splice(index, 1);
  return true;
};