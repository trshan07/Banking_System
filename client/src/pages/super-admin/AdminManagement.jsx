import React, { useCallback, useEffect, useState } from 'react';
import { FaCrown, FaEdit, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';

const emptyForm = { firstName: '', lastName: '', username: '', email: '', password: '', phone: '', address: '', status: 'active' };

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/superadmin/admins');
      setAdmins(data.data?.admins || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load administrators');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (admin) => {
    setEditingId(admin.id || admin._id);
    setForm({ firstName: admin.firstName, lastName: admin.lastName, username: admin.username || '', email: admin.email,
      password: '', phone: admin.phone || '', address: admin.address || '', status: admin.status || 'active' });
    setShowModal(true);
  };
  const change = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      if (editingId) await api.put(`/superadmin/admins/${editingId}`, payload);
      else await api.post('/superadmin/admins', payload);
      toast.success(`Administrator ${editingId ? 'updated' : 'created'} successfully`);
      setShowModal(false); await loadAdmins();
    } catch (error) { toast.error(error.response?.data?.message || 'Could not save administrator'); }
    finally { setSaving(false); }
  };

  const remove = async (admin) => {
    if (!window.confirm(`Permanently delete ${admin.firstName} ${admin.lastName}?`)) return;
    try {
      await api.delete(`/superadmin/admins/${admin.id || admin._id}`);
      toast.success('Administrator deleted'); await loadAdmins();
    } catch (error) { toast.error(error.response?.data?.message || 'Could not delete administrator'); }
  };

  return <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div><h1 className="text-3xl font-bold flex items-center gap-3"><FaCrown className="text-amber-500" />Admin Management</h1>
          <p className="text-slate-600 mt-1">Create, view, update and delete website administrators.</p></div>
        <button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> Create Admin</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[['Total admins', admins.length], ['Active', admins.filter((a) => a.status === 'active').length], ['Restricted', admins.filter((a) => a.status !== 'active').length]].map(([label, value]) =>
          <div key={label} className="bg-white rounded-xl shadow p-5"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold mt-1">{value}</p></div>)}
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? <p className="p-10 text-center">Loading administrators...</p> : admins.length === 0 ? <div className="p-10 text-center text-slate-500"><FaUsers className="mx-auto text-4xl mb-3" />No administrators found.</div> :
        <table className="min-w-full"><thead className="bg-slate-100 text-left text-xs uppercase text-slate-500"><tr>{['Administrator','Username','Status','Created','Actions'].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{admins.map((admin) => <tr key={admin.id || admin._id}>
            <td className="px-5 py-4"><p className="font-semibold">{admin.firstName} {admin.lastName}</p><p className="text-sm text-slate-500">{admin.email}</p></td>
            <td className="px-5 py-4">{admin.username || '—'}</td><td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs capitalize ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{admin.status}</span></td>
            <td className="px-5 py-4 text-sm">{new Date(admin.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 whitespace-nowrap"><button onClick={() => openEdit(admin)} className="text-blue-600 mr-4"><FaEdit className="inline" /> Edit</button><button onClick={() => remove(admin)} className="text-red-600"><FaTrash className="inline" /> Delete</button></td>
          </tr>)}</tbody></table>}
      </div>
    </div>
    {showModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
      <div className="flex justify-between mb-5"><h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Administrator</h2><button onClick={() => setShowModal(false)} aria-label="Close">✕</button></div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        {[['firstName','First name','text'],['lastName','Last name','text'],['username','Username','text'],['email','Email','email'],['phone','Phone','tel'],['password', editingId ? 'New password (optional)' : 'Password','password']].map(([name,label,type]) => <label key={name} className="text-sm font-medium">{label}<input name={name} type={type} value={form[name]} onChange={change} required={!editingId || name !== 'password'} minLength={name === 'password' ? 8 : undefined} className="mt-1 w-full border rounded-lg p-2.5" /></label>)}
        <label className="text-sm font-medium">Status<select name="status" value={form.status} onChange={change} className="mt-1 w-full border rounded-lg p-2.5"><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option><option value="pending">Pending</option></select></label>
        <label className="text-sm font-medium sm:col-span-2">Address<textarea name="address" value={form.address} onChange={change} required rows="3" className="mt-1 w-full border rounded-lg p-2.5" /></label>
        <p className="text-xs text-slate-500 sm:col-span-2">Passwords require at least 8 characters, uppercase, lowercase and a number.</p>
        <div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded-lg">Cancel</button><button disabled={saving} className="bg-purple-600 text-white px-5 py-2 rounded-lg disabled:opacity-50">{saving ? 'Saving...' : 'Save Administrator'}</button></div>
      </form></div></div>}
  </div>;
}
