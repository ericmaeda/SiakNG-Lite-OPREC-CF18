import { JadwalKelas, IrsEnrollment } from '@siakng/types'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

// Day order for weekly view
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

// Time slots (hourly from 07:00 to 20:00)
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', 
  '17:00', '18:00', '19:00', '20:00'
]

// Color palette for different courses
const COURSE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
]

function getCourseColor(index: number): string {
  return COURSE_COLORS[index % COURSE_COLORS.length]
}

function timeToSlot(time: string): number {
  const hour = parseInt(time.split(':')[0])
  return hour - 7 // 07:00 = slot 0
}

interface JadwalGridProps {
  enrollments: IrsEnrollment[]
  showHeader?: boolean
  onEnrollmentClick?: (enrollment: IrsEnrollment) => void
}

/**
 * JadwalGrid - Weekly schedule visualization
 * Displays enrollments in a weekly grid (Mon-Sat rows, time columns)
 */
export function JadwalGrid({ enrollments, showHeader = true, onEnrollmentClick }: JadwalGridProps) {
  // Build schedule data
  const scheduleByDayAndSlot: Record<string, { enrollment: IrsEnrollment; jadwal: JadwalKelas; slot: number }[]> = {}
  
  for (const enrollment of enrollments) {
    if (enrollment.status !== 'aktif') continue
    
    // Handle both single schedule (legacy) and multiple schedules (new)
    const jadwalList = enrollment.kelas.jadwal && enrollment.kelas.jadwal.length > 0
      ? enrollment.kelas.jadwal
      : enrollment.kelas.hari && enrollment.kelas.jamMulai
        ? [{ 
            id: enrollment.kelas.id, 
            kelasId: enrollment.kelas.id,
            hari: enrollment.kelas.hari!, 
            jamMulai: enrollment.kelas.jamMulai!, 
            jamSelesai: enrollment.kelas.jamSelesai!,
            ruangan: enrollment.kelas.ruangan,
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        : []
    
    for (const jadwal of jadwalList) {
      const dayIndex = DAYS.indexOf(jadwal.hari)
      if (dayIndex === -1) continue
      
      const startSlot = timeToSlot(jadwal.jamMulai)
      const endSlot = timeToSlot(jadwal.jamSelesai)
      
      for (let slot = startSlot; slot < endSlot; slot++) {
        const key = `${dayIndex}-${slot}`
        if (!scheduleByDayAndSlot[key]) {
          scheduleByDayAndSlot[key] = []
        }
        scheduleByDayAndSlot[key].push({ enrollment, jadwal, slot })
      }
    }
  }

  // Get unique enrollments for color assignment
  const uniqueEnrollments = enrollments.filter(e => e.status === 'aktif')
  const enrollmentIndexMap = new Map<string, number>()
  uniqueEnrollments.forEach((e, i) => enrollmentIndexMap.set(e.id, i))

  const renderCell = (dayIndex: number, slot: number) => {
    const key = `${dayIndex}-${slot}`
    const cellData = scheduleByDayAndSlot[key]
    
    if (!cellData || cellData.length === 0) {
      return <div key={key} className="h-12 border-t border-r border-gray-700 bg-gray-900/30"></div>
    }

    // Check if this is the start of a class block
    const firstSlot = cellData.filter(c => c.slot === slot)
    if (firstSlot.length === 0) {
      return <div key={key} className="h-12 border-t border-r border-gray-700 bg-gray-900/30"></div>
    }

    // Render first class block that starts at this slot
    const { enrollment, jadwal } = firstSlot[0]
    const colorIndex = enrollmentIndexMap.get(enrollment.id) ?? 0
    const color = getCourseColor(colorIndex)
    
    const startSlot = timeToSlot(jadwal.jamMulai)
    const endSlot = timeToSlot(jadwal.jamSelesai)
    const rowSpan = endSlot - startSlot
    
    // Only render at start position
    if (slot !== startSlot) {
      return null
    }

    return (
      <div 
        key={key}
        className="h-12 border-t border-r border-gray-700 overflow-hidden"
        style={{ 
          backgroundColor: color + '40', // 25% opacity
          borderLeft: `3px solid ${color}`
        }}
        onClick={() => onEnrollmentClick?.(enrollment)}
      >
        {slot === startSlot && (
          <div className="p-1 h-full overflow-hidden">
            <div 
              className="text-xs font-medium truncate cursor-pointer hover:underline"
              style={{ color: color }}
              onClick={(e) => {
                e.stopPropagation()
                onEnrollmentClick?.(enrollment)
              }}
            >
              {enrollment.mataKuliah?.kode}
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              {jadwal.jamMulai}-{jadwal.jamSelesai}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      {showHeader && (
        <div className="flex mb-2">
          <div className="w-16 flex-shrink-0"></div>
          {DAYS.map(day => (
            <div 
              key={day} 
              className="flex-1 text-center text-sm font-medium py-2"
              style={{ color: colors.primary }}
            >
              {day}
            </div>
          ))}
        </div>
      )}
      
      {/* Grid */}
      <div className="flex">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0">
          {TIME_SLOTS.map((time, slot) => (
            <div 
              key={time}
              className="h-12 text-xs text-gray-500 flex items-center justify-end pr-2 border-t border-gray-800"
            >
              {time}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="flex-1 min-w-[100px]">
            {TIME_SLOTS.map((_, slot) => renderCell(dayIndex, slot))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Compact jadwal display for enrollment cards
 */
export function JadwalList({ enrollments }: { enrollments: IrsEnrollment[] }) {
  return (
    <div className="space-y-2">
      {enrollments.map(enrollment => {
        const jadwalList = enrollment.kelas.jadwal && enrollment.kelas.jadwal.length > 0
          ? enrollment.kelas.jadwal
          : enrollment.kelas.hari
            ? [{ 
                id: enrollment.kelas.id, 
                kelasId: enrollment.kelas.id,
                hari: enrollment.kelas.hari!, 
                jamMulai: enrollment.kelas.jamMulai!, 
                jamSelesai: enrollment.kelas.jamSelesai!,
                ruangan: enrollment.kelas.ruangan,
                createdAt: new Date(),
                updatedAt: new Date()
              }]
            : []

        return (
          <div key={enrollment.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {enrollment.mataKuliah?.nama}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded" 
                style={{ backgroundColor: '#333', color: colors.tertiary }}>
                {enrollment.mataKuliah?.kode}
              </span>
            </div>
            {jadwalList.map((jadwal, idx) => (
              <div key={jadwal.id} className="text-sm text-gray-400 flex items-center gap-2 ml-2">
                <span className="w-16">{jadwal.hari}</span>
                <span>{jadwal.jamMulai} - {jadwal.jamSelesai}</span>
                {jadwal.ruangan && <span className="text-gray-500">• {jadwal.ruangan}</span>}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Error display for jadwal conflict with detailed information
 */
export function ConflictError({ error }: { error: string }) {
  // Parse conflict info from error message
  // Format: "Jadwal bentrok! Kelas yang ingin diambil (Senin 08:00-10:00) bertabrakan dengan Algoritma (Senin 09:00-11:00 di ruangan sama). Silakan pilih kelas lain atau jadwal lain."
  
  const targetMatch = error.match(/Kelas yang ingin diambil \((\w+) (\d{2}:\d{2})-(\d{2}:\d{2})\)/)
  const conflictingMatch = error.match(/bertabrakan dengan (\w+) \((\w+) (\d{2}:\d{2})-(\d{2}:\d{2})/i)
  
  return (
    <div 
      className="p-4 rounded-lg mb-4"
      style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h4 className="font-bold text-white mb-2">Jadwal Bentrok!</h4>
          <p className="text-gray-300 text-sm mb-3">
            Mata kuliah yang ingin Anda ambil memiliki jadwal yang bertabrakan dengan mata kuliah lain dalam IRS Anda.
          </p>
          
          {/* Visual conflict representation */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div 
              className="p-2 rounded"
              style={{ backgroundColor: '#3A2020' }}
            >
              <div className="text-xs text-gray-400 mb-1">Mata Kuliah Ingin Diambil</div>
              {targetMatch && (
                <>
                  <div className="font-medium text-white">{targetMatch[1]}</div>
                  <div className="text-sm text-gray-400">{targetMatch[2]} - {targetMatch[3]}</div>
                </>
              )}
            </div>
            <div 
              className="p-2 rounded"
              style={{ backgroundColor: colors.danger + '40' }}
            >
              <div className="text-xs text-gray-400 mb-1">Bertabrakan Dengan</div>
              {conflictingMatch && (
                <>
                  <div className="font-medium text-white">{conflictingMatch[1]}</div>
                  <div className="text-sm text-gray-400">{conflictingMatch[3]} - {conflictingMatch[4]}</div>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-xs mt-3">
            Silakan pilih jadwal lain atau lepas mata kuliah yang bentrok terlebih dahulu.
          </p>
        </div>
      </div>
    </div>
  )
}