/**
 * Example usage of BaseRepository
 *
 * Create a repository for your entity by extending BaseRepository:
 *
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { InjectRepository } from '@nestjs/typeorm';
 * import { Repository } from 'typeorm';
 * import { BaseRepository } from '@/common/repositories/base.repository';
 * import { User } from './entities/user.entity';
 *
 * @Injectable()
 * export class UserRepository extends BaseRepository<User> {
 *   protected entityName = 'User';
 *
 *   constructor(
 *     @InjectRepository(User)
 *     protected repository: Repository<User>,
 *   ) {
 *     super();
 *   }
 *
 *   // Add custom methods specific to User
 *   async findByEmail(email: string): Promise<User | null> {
 *     return this.findOne({ email } as any);
 *   }
 *
 *   async findActiveUsers(): Promise<User[]> {
 *     return this.findAll({
 *       where: { isActive: true } as any,
 *     });
 *   }
 * }
 * ```
 *
 * Then use it in your service:
 *
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   constructor(private readonly userRepository: UserRepository) {}
 *
 *   async getUser(id: string) {
 *     return this.userRepository.findById(id);
 *   }
 *
 *   async createUser(data: CreateUserDto) {
 *     return this.userRepository.create(data);
 *   }
 *
 *   async updateUser(id: string, data: UpdateUserDto) {
 *     return this.userRepository.update(id, data);
 *   }
 *
 *   async deleteUser(id: string) {
 *     return this.userRepository.delete(id);
 *   }
 *
 *   async getUsersPaginated(page: number, limit: number) {
 *     return this.userRepository.findWithPagination({}, page, limit);
 *   }
 * }
 * ```
 */

export {};
