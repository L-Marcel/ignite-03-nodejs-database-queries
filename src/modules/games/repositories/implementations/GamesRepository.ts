import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .select("title")
      .where("LOWER(game.title) like :param", {
        param: `%${param}%`
      }).execute();

    return result;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const result = await this.repository.query("SELECT COUNT(id) AS count FROM games");
    return result
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .select("users.first_name, users.email, users.last_name")
      .innerJoin("users_games_games", "ug", "ug.gamesId = game.id")
      .innerJoin("users", "users", "users.id = ug.usersId")
      .where("game.id = :id", { id })
      .execute();

    return result;
  }
}
