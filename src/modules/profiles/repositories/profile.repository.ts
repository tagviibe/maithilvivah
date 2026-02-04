import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Profile } from '../entities/profile.entity';
import { BasicInfoDto } from '../dto/basic-info.dto';
import { CommunityInfoDto } from '../dto/community-info.dto';
import { LocationInfoDto } from '../dto/location-info.dto';
import { EducationInfoDto } from '../dto/education-info.dto';
import { FamilyInfoDto } from '../dto/family-info.dto';
import { LifestyleInfoDto } from '../dto/lifestyle-info.dto';

@Injectable()
export class ProfileRepository extends BaseRepository<Profile> {
  protected entityName = 'Profile';

  constructor(
    @InjectRepository(Profile)
    protected repository: Repository<Profile>,
  ) {
    super();
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const startTime = Date.now();
    const profile = await this.repository.findOne({
      where: { user_id: userId },
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM profiles WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    return profile;
  }

  async createProfile(userId: string): Promise<Profile> {
    const startTime = Date.now();
    const profile = this.repository.create({ user_id: userId });
    const savedProfile = await this.repository.save(profile);

    this.logger.logDatabaseQuery(
      `INSERT INTO profiles (user_id) VALUES ($1)`,
      [userId],
      Date.now() - startTime,
    );

    return savedProfile;
  }

  async updateBasicInfo(userId: string, data: BasicInfoDto): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }

  async updateCommunityInfo(
    userId: string,
    data: CommunityInfoDto,
  ): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }

  async updateLocationInfo(
    userId: string,
    data: LocationInfoDto,
  ): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }

  async updateEducationInfo(
    userId: string,
    data: EducationInfoDto,
  ): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }

  async updateFamilyInfo(
    userId: string,
    data: FamilyInfoDto,
  ): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }

  async updateLifestyleInfo(
    userId: string,
    data: LifestyleInfoDto,
  ): Promise<Profile> {
    const startTime = Date.now();
    await this.repository.update({ user_id: userId }, data);
    const profile = await this.findByUserId(userId);

    this.logger.logDatabaseQuery(
      `UPDATE profiles SET ... WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    if (!profile) {
      throw new Error('Profile not found after update');
    }

    return profile;
  }
}
