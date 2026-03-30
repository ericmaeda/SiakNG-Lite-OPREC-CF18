import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../lib/auth-context'
import { api } from '../lib/api'
import type { MataKuliah } from '@siakng/types'

export function Matakuliah() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matakuliah, setMatakuliah] = useState<MataKuliah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isDosen = user?.role === 'DOSEN'

  useEffect(() => {
    loadMataKuliah()
  }, [])

  const loadMataKuliah = async () => {
    try {
      setIsLoading(true)
      const data = await api.getMataKuliah() as MataKuliah[]
      setMatakuliah(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load mata kuliah')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mata kuliah?')) return
    
    try {
      await api.deleteMataKuliah(id)
      setMatakuliah(matakuliah.filter(mk => mk.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to delete mata kuliah')
    }
  }

  const handleAdd = async (id: string) => {
    
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Mata Kuliah</h1>
        {isDosen && (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate('/matakuliah/tambah')}
          >
            Tambah Mata Kuliah
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {matakuliah.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No mata kuliah found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 border border-gray-200">Kode</th>
                <th className="p-4 border border-gray-200">Nama</th>
                <th className="p-4 border border-gray-200">SKS</th>
                <th className="p-4 border border-gray-200">Semester</th>
                {isDosen && <th className="p-4 border border-gray-200">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {matakuliah.map((mk) => (
                <tr key={mk.id} className="hover:bg-gray-50">
                  <td className="p-4 border border-gray-200">{mk.kode}</td>
                  <td className="p-4 border border-gray-200">{mk.nama}</td>
                  <td className="p-4 border border-gray-200">{mk.sks}</td>
                  <td className="p-4 border border-gray-200">{mk.semester}</td>
                  {isDosen && (
                    <td className="p-4 border border-gray-200">
                      <button 
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => console.log('Edit:', mk.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(mk.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
