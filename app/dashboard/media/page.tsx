'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, CloudUpload as UploadCloud, Trash2, Check, X, Link2, FileText, Presentation, Image as ImageIcon, Video, File as FileIcon, ExternalLink, Loader as Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase, MEDIA_BUCKET, type MediaItem, type MediaCategory } from '@/lib/supabase';

type CategoryTab = {
  key: MediaCategory | 'all';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const CATEGORIES: CategoryTab[] = [
  { key: 'all', label: 'All', icon: ImageIcon },
  { key: 'photo_video', label: 'Photos / Videos', icon: Video },
  { key: 'link', label: 'Links', icon: Link2 },
  { key: 'file', label: 'Files', icon: FileText },
  { key: 'presentation', label: 'Presentations', icon: Presentation },
];

const ACCEPTED_TYPES: Record<MediaCategory, string[]> = {
  photo_video: ['image/', 'video/'],
  link: [],
  file: ['application/', 'text/', 'image/', 'video/'],
  presentation: [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.apple.keynote',
  ],
};

function categoryForFile(file: File): MediaCategory {
  const type = file.type;
  if (type.startsWith('image/') || type.startsWith('video/')) return 'photo_video';
  if (
    type.startsWith('application/vnd') ||
    type.startsWith('application/pdf') ||
    type.includes('presentation') ||
    type.includes('powerpoint') ||
    type.includes('keynote')
  ) {
    return 'presentation';
  }
  return 'file';
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let val = bytes;
  let i = 0;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(val < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MediaCatalogPage() {
  const { session, status } = useAuth();
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<CategoryTab['key']>('all');
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const user = session?.user;
  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'LP';

  const loadItems = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (queryError) {
      setError(queryError.message);
    } else {
      setItems((data ?? []) as MediaItem[]);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = React.useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    setDeleting(true);
    setError(null);
    const toDelete = items.filter((i) => selected.has(i.id));
    // Remove files from storage (ignore errors for link items with no path)
    await Promise.all(
      toDelete
        .filter((i) => i.storage_path)
        .map(async (i) => {
          const { error: storageErr } = await supabase.storage
            .from(MEDIA_BUCKET)
            .remove([i.storage_path as string]);
          if (storageErr) console.warn('storage remove failed', storageErr.message);
        })
    );
    const { error: dbErr } = await supabase
      .from('media_items')
      .delete()
      .in('id', Array.from(selected));
    setDeleting(false);
    setDeleteOpen(false);
    if (dbErr) {
      setError(dbErr.message);
    } else {
      exitSelectMode();
      await loadItems();
    }
  };

  const selectedCount = selected.size;

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[280px] bg-gradient-to-b from-emerald-50/60 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* Navigation Header */}
        <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Media Catalog
              </h1>
              <p className="text-xs text-muted-foreground">
                {status === 'authenticated' ? user?.name : 'Not signed in'} · Manage your assets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectMode && selectedCount > 0 ? (
              <Button
                variant="destructive"
                className="h-10 rounded-full px-5 font-semibold shadow-sm"
                onClick={() => setDeleteOpen(true)}
                disabled={deleting}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete Selected ({selectedCount})
              </Button>
            ) : null}
            <Button
              variant={selectMode ? 'outline' : 'default'}
              className="h-10 rounded-full px-5 font-semibold shadow-sm"
              onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            >
              {selectMode ? (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  Done
                </>
              ) : (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Select
                </>
              )}
            </Button>
            <Button
              className="h-10 rounded-full px-5 font-semibold shadow-sm"
              onClick={() => setUploadOpen(true)}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Upload Media
            </Button>
          </div>
        </header>

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const active = activeCategory === tab.key;
            const count =
              tab.key === 'all'
                ? items.length
                : items.filter((i) => i.category === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  active
                    ? 'bg-foreground text-background shadow-sm'
                    : 'border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span
                  className={cn(
                    'ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                    active ? 'bg-background/20 text-background' : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Gallery */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading your media…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onUpload={() => setUploadOpen(true)} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  selectMode={selectMode}
                  selected={selected.has(item.id)}
                  onToggle={() => toggleSelect(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={loadItems}
        activeCategory={activeCategory === 'all' ? null : activeCategory}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} item{selectedCount !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected asset{selectedCount !== 1 ? 's' : ''} from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------- Media Card ---------- */

function MediaCard({
  item,
  selectMode,
  selected,
  onToggle,
}: {
  item: MediaItem;
  selectMode: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const isLink = item.category === 'link';
  const isVideo = item.mime_type?.startsWith('video/') || item.category === 'photo_video' && item.url.match(/\.(mp4|mov|webm|avi)/i);
  const isImage = item.mime_type?.startsWith('image/') || (!isVideo && !isLink && (item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i) ?? false));

  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all',
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
          : 'border-border hover:border-border/80 hover:shadow-md'
      )}
      onClick={selectMode ? onToggle : undefined}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {isLink ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Link2 className="h-6 w-6" />
            </div>
            <p className="line-clamp-2 text-xs font-medium text-foreground/80">
              {item.url}
            </p>
          </div>
        ) : isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url || item.url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : isVideo ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-secondary/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 text-foreground">
              <Video className="h-6 w-6" />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-secondary/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 text-foreground">
              <FileIcon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {(item.mime_type || 'file').split('/').pop()}
            </span>
          </div>
        )}

        {/* Select checkbox */}
        {selectMode && (
          <div
            className={cn(
              'absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
              selected
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-white/80 bg-black/30 text-transparent backdrop-blur-sm'
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </div>
        )}

        {/* Hover overlay for non-select mode */}
        {!selectMode && !isLink && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">{item.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {formatBytes(item.size_bytes) || formatDate(item.created_at)}
          </p>
        </div>
        {isLink ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Empty State ---------- */

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <ImageIcon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
        No media yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Upload photos, videos, files, or presentations to get started. Your assets will appear here in a clean grid.
      </p>
      <Button className="mt-5 h-10 rounded-full px-5 font-semibold" onClick={onUpload}>
        <Plus className="mr-1.5 h-4 w-4" />
        Upload Media
      </Button>
    </div>
  );
}

/* ---------- Upload Modal ---------- */

function UploadModal({
  open,
  onOpenChange,
  onUploaded,
  activeCategory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
  activeCategory: MediaCategory | null;
}) {
  const [mode, setMode] = React.useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkName, setLinkName] = React.useState('');
  const [linkCategory, setLinkCategory] = React.useState<MediaCategory>('link');
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setMode('file');
      setLinkUrl('');
      setLinkName('');
      setLinkCategory(activeCategory === 'link' ? 'link' : activeCategory ?? 'link');
      setPendingFiles([]);
      setProgress(0);
      setError(null);
    }
  }, [open, activeCategory]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPendingFiles(Array.from(files));
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const uploadFiles = async () => {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        const category = categoryForFile(file);
        const ext = file.name.split('.').pop() ?? 'bin';
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
        const path = `${category}/${safeName}`;

        const { error: upErr } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage
          .from(MEDIA_BUCKET)
          .getPublicUrl(path);

        let thumbnailUrl: string | null = null;
        if (file.type.startsWith('image/')) {
          thumbnailUrl = pub.publicUrl;
        }

        const { error: dbErr } = await supabase.from('media_items').insert({
          category,
          name: file.name,
          storage_path: path,
          url: pub.publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
          thumbnail_url: thumbnailUrl,
        });
        if (dbErr) throw dbErr;

        setProgress(Math.round(((i + 1) / pendingFiles.length) * 100));
      }
      setPendingFiles([]);
      onUploaded();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveLink = async () => {
    if (!linkUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    let validUrl = linkUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }
    setUploading(true);
    setError(null);
    try {
      const { error: dbErr } = await supabase.from('media_items').insert({
        category: linkCategory,
        name: linkName.trim() || validUrl,
        storage_path: null,
        url: validUrl,
        mime_type: null,
        size_bytes: null,
        thumbnail_url: null,
      });
      if (dbErr) throw dbErr;
      setLinkUrl('');
      setLinkName('');
      onUploaded();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save link');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Add photos, videos, files, or links to your catalog.
          </DialogDescription>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <button
            type="button"
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              mode === 'file' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('file')}
          >
            <UploadCloud className="mr-1.5 inline h-4 w-4" />
            Files
          </button>
          <button
            type="button"
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              mode === 'link' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMode('link')}
          >
            <Link2 className="mr-1.5 inline h-4 w-4" />
            Link
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {mode === 'file' ? (
          <div className="space-y-4">
            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition-colors',
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-border bg-secondary/30'
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                Drag &amp; drop files here
              </p>
              <p className="text-xs text-muted-foreground">
                or use the button below
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Pending files list */}
            {pendingFiles.length > 0 && (
              <div className="space-y-2">
                {pendingFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground">
                      <FileIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{f.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatBytes(f.size)} · {categoryForFile(f).replace('_', ' / ')}
                      </p>
                    </div>
                    {!uploading && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setPendingFiles((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {uploading && progress > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading… {progress}%
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/resource"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Name <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="My resource link"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="flex flex-wrap gap-2">
                {(['link', 'file', 'presentation', 'photo_video'] as MediaCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLinkCategory(cat)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      linkCategory === cat
                        ? 'bg-foreground text-background'
                        : 'border border-border bg-background text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    {cat === 'photo_video' ? 'Photo / Video' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancel
          </Button>
          {mode === 'file' ? (
            <Button onClick={uploadFiles} disabled={uploading || pendingFiles.length === 0}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload {pendingFiles.length > 0 ? `${pendingFiles.length} file${pendingFiles.length !== 1 ? 's' : ''}` : ''}
                </>
              )}
            </Button>
          ) : (
            <Button onClick={saveLink} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Add Link
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
