'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { NavigationLink } from '@/lib/types';
import { NavigationLinkFormData } from '@/lib/validations';
import { LinkForm } from './LinkForm';
import { Plus, Edit, Trash2, LogOut, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminDashboard() {
  const { logout } = useAuth();
  const {
    links,
    isLoading,
    error,
    createLink,
    updateLink,
    deleteLink,
    fetchLinks,
  } = useNavigation();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">
        {/* Navigation Links Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Navigation Links</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="w-32 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="w-48 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : links.length > 0 ? (
                    links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {link.favicon ? (
                              <img src={link.favicon} alt="" className="w-4 h-4" />
                            ) : (
                              <span>{link.icon || '🔗'}</span>
                            )}
                            <span className="font-medium">{link.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {new URL(link.url).hostname}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={link.category === 'internal' ? 'default' : 'secondary'}>
                            {link.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={link.isActive ? 'default' : 'destructive'}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingLink(link)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(link.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <p className="mb-2">No navigation links found</p>
                          <Button
                            size="sm"
                            onClick={() => setShowForm(true)}
                          >
                            Add your first link
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form Modal */}
      <LinkForm
        open={showForm || !!editingLink}
        link={editingLink || undefined}
        onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
        onCancel={() => {
          setShowForm(false);
          setEditingLink(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this navigation link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteLink(deleteConfirm!)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8 text-orange-600" />
            </div>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will be redirected to the home page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmLogout}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
