import 'dotenv/config';

import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'src/data/db.sqlite',
  synchronize: true,
  logging: false,
  entities: [User],
});
//
// dataSource.initialize().then(async () => {
//   const userRepository = dataSource.getRepository(User);
//   const u = new User();
//   u.age = 21;
//   u.hobbies = ['music'];
//   u.username = 'testuser3';
//   await userRepository.save(u);
//   const users = await userRepository.find();
//
//   console.log({ users });
// });
