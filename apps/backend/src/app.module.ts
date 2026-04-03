import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { MatakuliahController } from './presentation/controllers/matakuliah.controller';
import { DosenController } from './presentation/controllers/dosen.controller';
import { EnrollmentController } from './presentation/controllers/enrollment.controller';
import { IrsController } from './presentation/controllers/irs.controller';
import { MahasiswaController } from './presentation/controllers/mahasiswa.controller';
import { JadwalKelasController } from './presentation/controllers/jadwal-kelas.controller';
import { UserRepository } from './infrastructure/database/repositories/user.repository';
import { MataKuliahRepository } from './infrastructure/database/repositories/matakuliah.repository';
import { DosenRepository } from './infrastructure/database/repositories/dosen.repository';
import { MatakuliahMahasiswaRepository } from './infrastructure/database/repositories/matakuliah-mahasiswa.repository';
import { KelasRepository } from './infrastructure/database/repositories/kelas.repository';
import { IrsRepository } from './infrastructure/database/repositories/irs.repository';
import { JadwalKelasRepository } from './infrastructure/database/repositories/jadwal-kelas.repository';
import { MATAKULIAH_REPOSITORY } from './domain/repositories/matakuliah.repository.interface';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { DOSEN_REPOSITORY } from './domain/repositories/dosen.repository.interface';
import { MATAKULIAH_MAHASISWA_REPOSITORY } from './domain/repositories/matakuliah-mahasiswa.repository.interface';
import { KELAS_REPOSITORY } from './domain/repositories/kelas.repository.interface';
import { IRS_REPOSITORY } from './domain/repositories/irs.repository.interface';
import { JADWAL_KELAS_REPOSITORY } from './domain/repositories/jadwal-kelas.repository.interface';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [AppController, AuthController, MatakuliahController, DosenController, EnrollmentController, IrsController, MahasiswaController, JadwalKelasController],
  providers: [
    AppService, 
    UserRepository, 
    MataKuliahRepository,
    DosenRepository,
    MatakuliahMahasiswaRepository,
    KelasRepository,
    IrsRepository,
    JadwalKelasRepository,
    { provide: MATAKULIAH_REPOSITORY, useClass: MataKuliahRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: DOSEN_REPOSITORY, useClass: DosenRepository },
    { provide: MATAKULIAH_MAHASISWA_REPOSITORY, useClass: MatakuliahMahasiswaRepository },
    { provide: KELAS_REPOSITORY, useClass: KelasRepository },
    { provide: IRS_REPOSITORY, useClass: IrsRepository },
    { provide: JADWAL_KELAS_REPOSITORY, useClass: JadwalKelasRepository }
  ],
})
export class AppModule {}
