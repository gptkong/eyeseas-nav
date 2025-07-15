'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { navigationLinkSchema, NavigationLinkFormData } from '@/lib/validations';
import { NavigationLink } from '@/lib/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface LinkFormProps {
  link?: NavigationLink;
  onSubmit: (data: NavigationLinkFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  open?: boolean;
}

export function LinkForm({ link, onSubmit, onCancel, isLoading, open = true }: LinkFormProps) {
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
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Navigation Link' : 'Add New Navigation Link'}
          </DialogTitle>
        </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter link title"
                  className={errors.title ? 'border-destructive' : ''}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="internalUrl">Internal URL *</Label>
              <Input
                id="internalUrl"
                type="url"
                placeholder="https://internal.example.com"
                className={errors.internalUrl ? 'border-destructive' : ''}
                {...register('internalUrl')}
              />
              {errors.internalUrl && (
                <p className="text-sm text-destructive">{errors.internalUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">External URL *</Label>
              <Input
                id="externalUrl"
                type="url"
                placeholder="https://external.example.com"
                className={errors.externalUrl ? 'border-destructive' : ''}
                {...register('externalUrl')}
              />
              {errors.externalUrl && (
                <p className="text-sm text-destructive">{errors.externalUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of this link"
                className={`h-20 ${errors.description ? 'border-destructive' : ''}`}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  type="text"
                  placeholder="Icon name or emoji"
                  {...register('icon')}
                />
                <p className="text-sm text-muted-foreground">Use emoji or icon name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL (optional)</Label>
                <Input
                  id="favicon"
                  type="url"
                  placeholder="https://example.com/favicon.ico"
                  className={errors.favicon ? 'border-destructive' : ''}
                  {...register('favicon')}
                />
                {errors.favicon && (
                  <p className="text-sm text-destructive">{errors.favicon.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                className="sr-only"
                {...register('isActive')}
              />
              <Switch
                checked={link?.isActive ?? true}
                onCheckedChange={(checked) => {
                  const event = { target: { name: 'isActive', checked } };
                  register('isActive').onChange(event);
                }}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">
                Active
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Inactive links won&apos;t be displayed to users
            </p>
          </form>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Link' : 'Create Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
