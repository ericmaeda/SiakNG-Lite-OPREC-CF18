// Placeholder for Matakuliah page
// TODO: Connect to backend API for matakuliah data

export function Matakuliah() {
  // Mock data - will be replaced with API call
  const matakuliahList = [
    { id: 1, kode: 'CS101', nama: 'Dasar Pemrograman', sks: 4, semester: 1 },
    { id: 2, kode: 'CS201', nama: 'Struktur Data', sks: 4, semester: 2 },
    { id: 3, kode: 'CS301', nama: 'Algoritma & Kompleksitas', sks: 3, semester: 3 },
    { id: 4, kode: 'DB101', nama: 'Basis Data', sks: 3, semester: 2 },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Mata Kuliah</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border border-gray-200">Kode</th>
              <th className="p-4 border border-gray-200">Nama</th>
              <th className="p-4 border border-gray-200">SKS</th>
              <th className="p-4 border border-gray-200">Semester</th>
            </tr>
          </thead>
          <tbody>
            {matakuliahList.map((mk) => (
              <tr key={mk.id} className="hover:bg-gray-50">
                <td className="p-4 border border-gray-200">{mk.kode}</td>
                <td className="p-4 border border-gray-200">{mk.nama}</td>
                <td className="p-4 border border-gray-200">{mk.sks}</td>
                <td className="p-4 border border-gray-200">{mk.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
