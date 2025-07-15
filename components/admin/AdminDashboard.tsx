'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { NavigationLink } from '@/lib/types';
import { NavigationLinkFormData } from '@/lib/validations';
import { LinkForm } from './LinkForm';
import { StatsCards } from '../StatsCards';
import { Plus, Edit, Trash2, LogOut, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const { logout } = useAuth();
  const {
    links,
    stats,
    isLoading,
    error,
    createLink,
    updateLink,
    deleteLink,
    fetchLinks,
    fetchStats,
  } = useNavigation();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateLink = async (data: NavigationLinkFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createLink(data);
      if (result.success) {
        setShowForm(false);
      } else {
        alert(result.error || 'Failed to create link');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (data: NavigationLinkFormData) => {
    if (!editingLink) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateLink(editingLink.id, data);
      if (result.success) {
        setEditingLink(null);
      } else {
        alert(result.error || 'Failed to update link');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    const result = await deleteLink(id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      alert(result.error || 'Failed to delete link');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="container mx-auto">
          <div className="alert alert-error">
            <span>Error: {error}</span>
            <button className="btn btn-sm" onClick={() => { fetchLinks(); fetchStats(); }}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
        <div className="container mx-auto">
          <div className="flex-1">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex-none gap-2">
            <Link href="/" className="btn btn-ghost btn-sm">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Navigation Links</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4" />
            Add New Link
          </button>
        </div>

        {/* Links Table */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td><div className="w-32 h-4 bg-base-300 rounded animate-pulse"></div></td>
                        <td><div className="w-48 h-4 bg-base-300 rounded animate-pulse"></div></td>
                        <td><div className="w-16 h-4 bg-base-300 rounded animate-pulse"></div></td>
                        <td><div className="w-16 h-4 bg-base-300 rounded animate-pulse"></div></td>
                        <td><div className="w-24 h-4 bg-base-300 rounded animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : links.length > 0 ? (
                    links.map((link) => (
                      <tr key={link.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            {link.favicon ? (
                              <img src={link.favicon} alt="" className="w-4 h-4" />
                            ) : (
                              <span>{link.icon || '🔗'}</span>
                            )}
                            <span className="font-medium">{link.title}</span>
                          </div>
                        </td>
                        <td>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary flex items-center gap-1"
                          >
                            {new URL(link.url).hostname}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td>
                          <div className={`badge ${link.category === 'internal' ? 'badge-primary' : 'badge-secondary'} badge-sm`}>
                            {link.category}
                          </div>
                        </td>
                        <td>
                          <div className={`badge ${link.isActive ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => setEditingLink(link)}
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-error"
                              onClick={() => setDeleteConfirm(link.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="text-base-content/60">
                          <p className="mb-2">No navigation links found</p>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowForm(true)}
                          >
                            Add your first link
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {(showForm || editingLink) && (
        <LinkForm
          link={editingLink || undefined}
          onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
          onCancel={() => {
            setShowForm(false);
            setEditingLink(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h3 className="font-bold text-lg">Confirm Delete</h3>
              <p className="py-4">Are you sure you want to delete this navigation link? This action cannot be undone.</p>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-ghost"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDeleteLink(deleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
