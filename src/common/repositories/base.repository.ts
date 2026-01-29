import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoggerService } from '../services/logger.service';

export abstract class BaseRepository<T extends ObjectLiteral> {
    protected abstract repository: Repository<T>;
    protected abstract entityName: string;
    protected logger: LoggerService;

    constructor() {
        this.logger = new LoggerService();
    }

    /**
     * Find one entity by ID
     */
    async findById(id: string): Promise<T> {
        const startTime = Date.now();
        const entity = await this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<T>,
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM ${this.entityName} WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );

        if (!entity) {
            throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }

        return entity;
    }

    /**
     * Find one entity by conditions
     */
    async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
        const startTime = Date.now();
        const entity = await this.repository.findOne({ where });

        this.logger.logDatabaseQuery(
            `SELECT * FROM ${this.entityName} WHERE ${JSON.stringify(where)}`,
            [],
            Date.now() - startTime,
        );

        return entity;
    }

    /**
     * Find one entity by conditions or throw error
     */
    async findOneOrFail(where: FindOptionsWhere<T>): Promise<T> {
        const entity = await this.findOne(where);

        if (!entity) {
            throw new NotFoundException(
                `${this.entityName} not found with given conditions`,
            );
        }

        return entity;
    }

    /**
     * Find all entities with optional conditions
     */
    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        const startTime = Date.now();
        const entities = await this.repository.find(options);

        this.logger.logDatabaseQuery(
            `SELECT * FROM ${this.entityName}`,
            [],
            Date.now() - startTime,
        );

        return entities;
    }

    /**
     * Find entities with pagination
     */
    async findWithPagination(
        options: FindManyOptions<T>,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: T[]; total: number }> {
        const startTime = Date.now();
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            ...options,
            skip,
            take: limit,
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM ${this.entityName} LIMIT ${limit} OFFSET ${skip}`,
            [],
            Date.now() - startTime,
        );

        return { data, total };
    }

    /**
     * Create a new entity
     */
    async create(data: DeepPartial<T>): Promise<T> {
        const startTime = Date.now();
        const entity = this.repository.create(data);
        const savedEntity = await this.repository.save(entity);

        this.logger.logDatabaseQuery(
            `INSERT INTO ${this.entityName}`,
            [JSON.stringify(data)],
            Date.now() - startTime,
        );

        return savedEntity;
    }

    /**
     * Update an entity by ID
     */
    async update(id: string, data: DeepPartial<T>): Promise<T> {
        const startTime = Date.now();
        const entity = await this.findById(id);

        const updatedEntity = this.repository.merge(entity, data);
        const savedEntity = await this.repository.save(updatedEntity);

        this.logger.logDatabaseQuery(
            `UPDATE ${this.entityName} SET ... WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );

        return savedEntity;
    }

    /**
     * Delete an entity by ID (soft delete if supported)
     */
    async delete(id: string): Promise<void> {
        const startTime = Date.now();
        const entity = await this.findById(id);

        // Check if entity has soft delete support
        if ('deletedAt' in entity) {
            await this.repository.softDelete(id);
        } else {
            await this.repository.delete(id);
        }

        this.logger.logDatabaseQuery(
            `DELETE FROM ${this.entityName} WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );
    }

    /**
     * Hard delete an entity by ID
     */
    async hardDelete(id: string): Promise<void> {
        const startTime = Date.now();
        await this.findById(id);
        await this.repository.delete(id);

        this.logger.logDatabaseQuery(
            `DELETE FROM ${this.entityName} WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );
    }

    /**
     * Restore a soft-deleted entity
     */
    async restore(id: string): Promise<void> {
        const startTime = Date.now();
        const result = await this.repository.restore(id);

        if (!result.affected) {
            throw new NotFoundException(
                `${this.entityName} with ID ${id} not found or not deleted`,
            );
        }

        this.logger.logDatabaseQuery(
            `UPDATE ${this.entityName} SET deletedAt = NULL WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );
    }

    /**
     * Count entities with optional conditions
     */
    async count(where?: FindOptionsWhere<T>): Promise<number> {
        const startTime = Date.now();
        const count = await this.repository.count({ where });

        this.logger.logDatabaseQuery(
            `SELECT COUNT(*) FROM ${this.entityName}`,
            [],
            Date.now() - startTime,
        );

        return count;
    }

    /**
     * Check if entity exists
     */
    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.count(where);
        return count > 0;
    }

    /**
     * Bulk create entities
     */
    async bulkCreate(data: DeepPartial<T>[]): Promise<T[]> {
        const startTime = Date.now();
        const entities = this.repository.create(data);
        const savedEntities = await this.repository.save(entities);

        this.logger.logDatabaseQuery(
            `INSERT INTO ${this.entityName} (bulk)`,
            [`${data.length} records`],
            Date.now() - startTime,
        );

        return savedEntities;
    }

    /**
     * Execute raw query
     */
    async query(sql: string, parameters?: any[]): Promise<any> {
        const startTime = Date.now();
        const result = await this.repository.query(sql, parameters);

        this.logger.logDatabaseQuery(sql, parameters, Date.now() - startTime);

        return result;
    }
}
