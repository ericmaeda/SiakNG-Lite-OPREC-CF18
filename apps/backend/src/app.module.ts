import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { MatakuliahController } from './presentation/controllers/matakuliah.controller';
import { UserRepository } from './infrastructure/database/repositories/user.repository';
import { MataKuliahRepository } from './infrastructure/database/repositories/matakuliah.repository';
import { MATAKULIAH_REPOSITORY } from './domain/repositories/matakuliah.repository.interface';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [AppController, AuthController, MatakuliahController],
  providers: [
    AppService, 
    UserRepository, 
    MataKuliahRepository,
    { provide: MATAKULIAH_REPOSITORY, useClass: MataKuliahRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository }
  ],
})
export class AppModule {}
