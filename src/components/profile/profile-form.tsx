'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MagicalLoading } from '@/components/ui/magical-loading';
import { MagicalError } from '@/components/ui/magical-error';
import { User, Save, Mail, Phone, MapPin } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ProfileFormProps {
  initialProfile?: UserProfile;
  userEmail?: string;
  onSave?: (profile: UserProfile) => Promise<void>;
}

export function ProfileForm({ initialProfile, userEmail, onSave }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: initialProfile?.firstName || '',
    lastName: initialProfile?.lastName || '',
    phone: initialProfile?.phone || '',
    address: initialProfile?.address || '',
    city: initialProfile?.city || '',
    postalCode: initialProfile?.postalCode || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (onSave) {
        await onSave(profile);
      } else {
        // Default save to API
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao guardar perfil');
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Algo correu mal ao guardar o perfil. Tenta novamente!'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = profile.firstName.trim() && profile.lastName.trim();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          O Teu Perfil
        </h2>
        <p className="text-gray-600">
          Mantém as tuas informações atualizadas para uma melhor experiência
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <MagicalError 
            title="Erro ao Guardar"
            message={error}
            showRetry={false}
            variant="gentle"
          />
        )}

        {success && (
          <div className="text-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="text-2xl mb-2">✨</div>
            <p className="text-green-700 font-medium">
              Perfil guardado com sucesso!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              O email não pode ser alterado
            </p>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Primeiro Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Ex: Maria"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Último Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Ex: Silva"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telemóvel
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Ex: +351 912 345 678"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Morada
            </Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>

          {/* City and Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ex: Porto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={profile.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Ex: 4000-123"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <MagicalLoading variant="inline" size="sm" text="A guardar..." />
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Guardar Perfil
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}