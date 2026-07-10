import React, { useEffect, useMemo, useState } from 'react'
import { MapPin, Navigation, Phone, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const serviceOptions = [
  { value: 'all', label: 'All services' },
  { value: 'atm', label: 'ATM' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'loan', label: 'Loans' },
  { value: 'account_opening', label: 'Account Opening' },
  { value: 'customer_service', label: 'Customer Service' },
]

const Branches = () => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [service, setService] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const response = await api.get('/branches')
        const data = response.data?.data?.branches || []
        setBranches(data)
        setSelectedBranch(data[0] || null)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load branches')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const filteredBranches = useMemo(() => {
    const term = query.trim().toLowerCase()
    return branches.filter((branch) => {
      const matchesSearch = !term || [
        branch.name,
        branch.code,
        branch.address,
        branch.city,
        branch.state,
        branch.country,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(term))

      const matchesService = service === 'all' || (branch.services || []).includes(service)
      return matchesSearch && matchesService
    })
  }, [branches, query, service])

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not available in this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await api.get('/branches/nearby', {
            params: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              distance: 25,
            },
          })
          const nearby = response.data?.data || []
          setBranches(nearby)
          setSelectedBranch(nearby[0] || null)
          toast.success(`Found ${nearby.length} branch${nearby.length === 1 ? '' : 'es'} near you`)
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to find nearby branches')
        }
      },
      () => toast.error('Could not access your location')
    )
  }

  const mapQuery = selectedBranch
    ? encodeURIComponent(
        selectedBranch.latitude && selectedBranch.longitude
          ? `${selectedBranch.latitude},${selectedBranch.longitude}`
          : `${selectedBranch.name} ${selectedBranch.address}`
      )
    : ''

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Branch Locator</h1>
          <p className="mt-3 max-w-2xl text-slate-200">
            Search Smart Bank branches by city, address, or service and open the selected location in Google Maps.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Search by city, branch, address..."
              />
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Navigation className="h-4 w-4" />
                Near Me
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {loading ? 'Loading branches...' : `${filteredBranches.length} branch${filteredBranches.length === 1 ? '' : 'es'} found`}
              </p>
            </div>
            <div className="max-h-[580px] divide-y divide-gray-200 overflow-y-auto">
              {filteredBranches.map((branch) => (
                <button
                  key={branch.id || branch._id || branch.code}
                  type="button"
                  onClick={() => setSelectedBranch(branch)}
                  className={`block w-full px-4 py-4 text-left hover:bg-gray-50 ${selectedBranch?.id === branch.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{branch.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{branch.address}</p>
                      <p className="mt-1 text-xs text-gray-500">{[branch.city, branch.state, branch.country].filter(Boolean).join(', ')}</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{branch.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(branch.services || []).slice(0, 4).map((item) => (
                      <span key={item} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {item.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
              {!loading && filteredBranches.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">No matching branches found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {selectedBranch ? (
            <>
              <iframe
                title="Google Maps branch preview"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-[420px] w-full border-0"
                loading="lazy"
              />
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-sm font-medium text-blue-600">{selectedBranch.code}</p>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBranch.name}</h2>
                  <p className="mt-2 flex gap-2 text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{selectedBranch.address}</span>
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    {selectedBranch.phone}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedBranch.services || []).map((item) => (
                    <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {item.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Navigation className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </div>
            </>
          ) : (
            <div className="flex h-[520px] items-center justify-center text-gray-500">
              Select a branch to preview it on the map.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Branches
