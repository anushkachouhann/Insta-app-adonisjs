import Follow from '#models/follow'
import User from '#models/user'

export class FollowService {
  public async getFollowerIds(userId: number): Promise<number[]> {
    const rows = await Follow.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .select(['follower_id'])
    return rows.map((r) => r.followerId)
  }

  public async getFollowingIds(userId: number): Promise<number[]> {
    const rows = await Follow.query()
      .where('follower_id', userId)
      .orderBy('created_at', 'desc')
      .select(['user_id'])
    return rows.map((r) => r.userId)
  }
 
  public async getUsersByIdsOrdered(ids: number[]) {
    if (ids.length === 0) return []
    const users = await User.query().whereIn('id', ids)
    const byId = new Map(users.map((u) => [u.id, u]))
    return ids.map((id) => byId.get(id)).filter(Boolean)
  }
}

