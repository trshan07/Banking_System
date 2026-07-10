import React from 'react'
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FaCoins } from 'react-icons/fa'
import ActiveAlerts from '../dashboard/ActiveAlerts'
import { formatCurrency } from '../../utils/formatters'

const CustomerAnalyticsPanel = ({ trendData = [], loanBreakdown = [], alerts = [], onDismiss }) => {
  const totals = trendData.reduce(
    (acc, point) => ({
      incoming: acc.incoming + (Number(point.incoming) || 0),
      outgoing: acc.outgoing + (Number(point.outgoing) || 0),
    }),
    { incoming: 0, outgoing: 0 }
  )

  const totalNet = totals.incoming - totals.outgoing
  const totalLoans = loanBreakdown.reduce((sum, item) => sum + (Number(item.value) || 0), 0)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-7">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Spending</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Transaction Overview</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Compare incoming and outgoing movement over the last few days.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Incoming</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {formatCurrency(totals.incoming)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Outgoing</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {formatCurrency(totals.outgoing)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Net</p>
                  <p className={`mt-1 break-words text-sm font-semibold ${totalNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(totalNet)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {trendData.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
                No transaction data available yet.
              </div>
            ) : (
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8eef6" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="incoming" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="outgoing" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-5">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Loans</p>
            <div className="mt-1 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Loan Status</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {totalLoans} total
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A quick look at your active and pending loan applications.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {loanBreakdown.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] bg-slate-50 text-sm text-slate-500">
                No loan records available yet.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="relative mx-auto h-[280px] w-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={loanBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={82}
                        outerRadius={118}
                        paddingAngle={3}
                      >
                        {loanBreakdown.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, 'Applications']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FaCoins className="mx-auto text-2xl text-slate-300" />
                      <p className="mt-2 text-3xl font-bold text-slate-900">{totalLoans}</p>
                      <p className="text-sm text-slate-500">Total</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {loanBreakdown.map((entry) => (
                    <div key={entry.key} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{entry.name}</p>
                          <p className="text-xs text-slate-500">Loan applications</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="dashboard-alerts" className="scroll-mt-36 xl:col-span-12">
        <ActiveAlerts alerts={alerts} onDismiss={onDismiss} />
      </div>
    </div>
  )
}

export default CustomerAnalyticsPanel
