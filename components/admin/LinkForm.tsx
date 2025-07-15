'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { navigationLinkSchema, NavigationLinkFormData } from '@/lib/validations';
import { NavigationLink } from '@/lib/types';
import { X } from 'lucide-react';

interface LinkFormProps {
  link?: NavigationLink;
  onSubmit: (data: NavigationLinkFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function LinkForm({ link, onSubmit, onCancel, isLoading }: LinkFormProps) {
  const isEditing = !!link;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NavigationLinkFormData>({
    resolver: zodResolver(navigationLinkSchema),
    defaultValues: link ? {
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      icon: link.icon || '',
      favicon: link.favicon || '',
      isActive: link.isActive,
    } : {
      category: 'internal',
      isActive: true,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-xl">
              {isEditing ? 'Edit Navigation Link' : 'Add New Navigation Link'}
            </h2>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter link title"
                  className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                  {...register('title')}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.title.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  className={`select select-bordered ${errors.category ? 'select-error' : ''}`}
                  {...register('category')}
                >
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.category.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">URL *</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className={`input input-bordered ${errors.url ? 'input-error' : ''}`}
                {...register('url')}
              />
              {errors.url && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.url.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                placeholder="Enter a brief description of this link"
                className={`textarea textarea-bordered h-20 ${errors.description ? 'textarea-error' : ''}`}
                {...register('description')}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Icon (optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Icon name or emoji"
                  className="input input-bordered"
                  {...register('icon')}
                />
                <label className="label">
                  <span className="label-text-alt">Use emoji or icon name</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Favicon URL (optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/favicon.ico"
                  className={`input input-bordered ${errors.favicon ? 'input-error' : ''}`}
                  {...register('favicon')}
                />
                {errors.favicon && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.favicon.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register('isActive')}
                />
              </label>
              <label className="label">
                <span className="label-text-alt">Inactive links won't be displayed to users</span>
              </label>
            </div>

            <div className="card-actions justify-end pt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Link' : 'Create Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
