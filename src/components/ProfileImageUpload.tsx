import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ 
  currentImageUrl, 
  onImageUpdate, 
  size = 'md' 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const uploadImage = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onImageUpdate(data.publicUrl);
      toast({
        title: "Profile picture updated!",
        description: "Your new profile picture has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      uploadImage(file);
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white font-bold border-4 border-white/30 shadow-xl overflow-hidden`}>
        {currentImageUrl ? (
          <img src={currentImageUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className={size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} />
        )}
      </div>
      <Button
        size="sm"
        className={`absolute ${size === 'lg' ? '-bottom-1 -right-1 w-8 h-8' : size === 'md' ? '-bottom-1 -right-1 w-7 h-7' : '-bottom-0.5 -right-0.5 w-6 h-6'} rounded-full p-0 bg-primary hover:bg-primary-dark`}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;