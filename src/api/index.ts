import { Request, Response } from 'express';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { dataSource } from '../db';
import { User } from '../entity/User';

const userRepository = dataSource.getRepository(User);

const getAllUsers = async (req: Request, res: Response) => {
  const users = await userRepository.find();
  res.status(200).json(users);
};

const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!uuidValidate(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  res.status(200).json(user);
};

const createUser = async (req: Request, res: Response) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age || !hobbies) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = new User();
  user.username = username;
  user.age = age;
  user.hobbies = hobbies;
  await userRepository.save(user);

  res.status(201).json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!uuidValidate(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const { username, age, hobbies } = req.body;

  if (!username || !age || !hobbies) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  user.username = username;
  user.age = age;
  user.hobbies = hobbies;
  await userRepository.save(user);
  res.status(200).json(user);
};

const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!uuidValidate(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  await userRepository.remove(user);
  res.status(204).send();
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUserById };
