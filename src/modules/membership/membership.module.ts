import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMembership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserMembership])],
    controllers: [MembershipController],
    providers: [MembershipService, MembershipRepository],
    exports: [MembershipService, MembershipRepository],
})
export class MembershipModule { }
