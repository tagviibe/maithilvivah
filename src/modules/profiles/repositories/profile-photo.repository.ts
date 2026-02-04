import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { ProfilePhoto } from '../entities/profile-photo.entity';
import { PhotoApprovalStatus } from '../enums/profile.enums';

@Injectable()
export class ProfilePhotoRepository extends BaseRepository<ProfilePhoto> {
  protected entityName = 'ProfilePhoto';

  constructor(
    @InjectRepository(ProfilePhoto)
    protected repository: Repository<ProfilePhoto>,
  ) {
    super();
  }

  async findByUserId(userId: string): Promise<ProfilePhoto[]> {
    const startTime = Date.now();
    const photos = await this.repository.find({
      where: { user_id: userId },
      order: { is_primary: 'DESC', created_at: 'ASC' },
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM profile_photos WHERE user_id = $1 ORDER BY is_primary DESC, created_at ASC`,
      [userId],
      Date.now() - startTime,
    );

    return photos;
  }

  async findPhotoById(photoId: string): Promise<ProfilePhoto | null> {
    const startTime = Date.now();
    const photo = await this.repository.findOne({
      where: { id: photoId },
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM profile_photos WHERE id = $1`,
      [photoId],
      Date.now() - startTime,
    );

    return photo;
  }

  async createPhoto(
    userId: string,
    photoUrl: string,
    photoKey: string,
  ): Promise<ProfilePhoto> {
    const startTime = Date.now();

    const photo = this.repository.create({
      user_id: userId,
      photo_url: photoUrl,
      photo_key: photoKey,
      approval_status: PhotoApprovalStatus.PENDING,
    });

    const savedPhoto = await this.repository.save(photo);

    this.logger.logDatabaseQuery(
      `INSERT INTO profile_photos (user_id, photo_url, photo_key) VALUES ($1, $2, $3)`,
      [userId, photoUrl, photoKey],
      Date.now() - startTime,
    );

    return savedPhoto;
  }

  async setPrimaryPhoto(userId: string, photoId: string): Promise<void> {
    const startTime = Date.now();

    // Remove primary from all photos
    await this.repository.update({ user_id: userId }, { is_primary: false });

    // Set new primary
    await this.repository.update(
      { id: photoId, user_id: userId },
      { is_primary: true },
    );

    this.logger.logDatabaseQuery(
      `UPDATE profile_photos SET is_primary WHERE user_id = $1 AND id = $2`,
      [userId, photoId],
      Date.now() - startTime,
    );
  }

  async deletePhoto(photoId: string, userId: string): Promise<void> {
    const startTime = Date.now();
    await this.repository.delete({ id: photoId, user_id: userId });

    this.logger.logDatabaseQuery(
      `DELETE FROM profile_photos WHERE id = $1 AND user_id = $2`,
      [photoId, userId],
      Date.now() - startTime,
    );
  }

  async countByUserId(userId: string): Promise<number> {
    const startTime = Date.now();
    const count = await this.repository.count({
      where: { user_id: userId },
    });

    this.logger.logDatabaseQuery(
      `SELECT COUNT(*) FROM profile_photos WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );

    return count;
  }

  async hasApprovedPhoto(userId: string): Promise<boolean> {
    const startTime = Date.now();
    const count = await this.repository.count({
      where: {
        user_id: userId,
        approval_status: PhotoApprovalStatus.APPROVED,
      },
    });

    this.logger.logDatabaseQuery(
      `SELECT COUNT(*) FROM profile_photos WHERE user_id = $1 AND approval_status = 'approved'`,
      [userId],
      Date.now() - startTime,
    );

    return count > 0;
  }
}
